import { Validation } from "../validation/validation";
import {
  checkOutByCartRequest,
  checkoutRequest,
  checkoutResponse,
  toCheckoutResponse,
  toTransactionForCustomerResponse,
  toTransactionForSelerResponse,
  transactionForSelerResponse,
  transactionUpdateRequest,
  transactuonForCustomerResponse,
} from "../model/transaction.model";
import { TransactionValidation } from "../validation/transaction.validation";
import { ResponseError } from "../error/response.error";
import { platformfee } from "../util/platfrom.fee";
import prisma from "../util/prisma";
import { Status, TransactionItem } from "@prisma/client";

export class TransactionService {
  static async checkoutDirect(dto: checkoutRequest): Promise<checkoutResponse> {
    const checkoutRequest = Validation.validate(
      TransactionValidation.checkout,
      dto
    );
    
    return await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.findUnique({
        where: { id: checkoutRequest.product_id },
      });

      if (!product) {
        throw new ResponseError("Product not found", 404);
      }

      if (product.stock < checkoutRequest.qty) {
        throw new ResponseError("Insufficient stock", 400);
      }

      const platformFee = platformfee;
      const subtotal = (product.price || 0) * checkoutRequest.qty;
      const grandTotal = subtotal + platformFee;
      
      console.log(subtotal)
      console.log(grandTotal)
      const transaction = await prisma.transaction.create({
        data: {
          user_id: checkoutRequest.user_id,
          platformFee : platformFee,
          grandTotal :grandTotal,
          status: "Pending",
          items: {
            create: [
              {
                price: product.price,
                qty: checkoutRequest.qty,
                product_id: checkoutRequest.product_id,
                subtotal: subtotal,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      await prisma.product.update({
        where: {
          id: checkoutRequest.product_id,
        },
        data: {
          stock: product.stock - checkoutRequest.qty,
        },
      });

      return toCheckoutResponse(transaction);
    });
  }

  static async checkOutByCart(
    dto: checkOutByCartRequest
  ): Promise<checkoutResponse> {
    const checkoutRrequest = Validation.validate(
      TransactionValidation.checkoutSomeInCart,
      dto
    );

    return await prisma.$transaction(async (prisma) => {
      const cartItems = await prisma.cart.findMany({
        where: {
          user_id: checkoutRrequest.user_id,
          id: {
            in: checkoutRrequest.itemIds,
          },
        },
        include: {
          product: true,
        },
      });

      if (cartItems.length === 0) {
        throw new ResponseError("Item not found", 404);
      }

      let grandTotal = 0;
      const platformFee = platformfee;

      const transactionItems = cartItems.map((item) => {
        const subtotal = item.product.price * item.qty;
        grandTotal += subtotal;

        return {
          price: item.product.price,
          qty: item.qty,
          product_id: item.product_id,
          subtotal: subtotal,
        };
      });

      grandTotal += platformFee;

      const transaction = await prisma.transaction.create({
        data: {
          user_id: checkoutRrequest.user_id,
          grandTotal,
          platformFee,
          items: {
            create: transactionItems,
          },
        },
        include: {
          items: true,
        },
      });

      await Promise.all(
        cartItems.map((item) => {
          prisma.product.update({
            where: {
              id: item.product_id,
            },
            data: {
              stock: item.product.stock - item.qty,
            },
          });
        })
      );

      await prisma.cart.deleteMany({
        where: {
          AND: [
            {
              user_id: checkoutRrequest.user_id,
            },
            {
              id: { in: checkoutRrequest.itemIds },
            },
          ],
        },
      });

      return toCheckoutResponse(transaction);
    });
  }

  static async getTransactionForSeler(
    userId: number
  ): Promise<transactionForSelerResponse[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        items: {
          some: {
            product: {
              user_id: userId,
            },
          },
        },
      },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const transactionsResponse = transactions.map((transaction) =>
      toTransactionForSelerResponse(transaction)
    );

    return transactionsResponse;
  }

  static async getTransactionForCustomer(
    userId: number
  ): Promise<transactuonForCustomerResponse[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return transactions.map((transaction) => {
      return toTransactionForCustomerResponse(transaction);
    });
  }

  static async update(
    dto: transactionUpdateRequest
  ): Promise<checkoutResponse> {
    const updateReq = Validation.validate(TransactionValidation.update, dto);

    const transaction = await prisma.transaction.update({
      where: {
        id: updateReq.id,
      },
      data: {
        status: updateReq.status as unknown as Status,
      },
      include: {
        items: true,
      },
    });

    return toCheckoutResponse(transaction);
  }
}
