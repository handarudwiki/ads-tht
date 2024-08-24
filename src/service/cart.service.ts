import { cartResponse, createCartRequest, toCartResponse, updateCartRequest } from "../model/cart.model";
import prisma from "../util/prisma";
import { CartValidation } from "../validation/cart.validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response.error";
import { Cart } from "@prisma/client";

export  class CartService {
    static async addToCart(dto:createCartRequest): Promise<cartResponse> {
        const createRequest = Validation.validate(CartValidation.create, dto)

        const productExist = await prisma.product.findUnique({
            where: {
                id: createRequest.product_id
            }
        });
        
        if(!productExist) {
            throw new ResponseError("Product not found", 404)
        }

        const productAlreadyExistInCart = await prisma.cart.findFirst({
            where: {
                product_id: createRequest.product_id,
                user_id: createRequest.user_id
            }
        });
        
        let cart:Cart;
        if(productAlreadyExistInCart) {
           cart = await prisma.cart.update({
                where: {
                    id: productAlreadyExistInCart.id
                },
                data: {
                    qty: productAlreadyExistInCart.qty + createRequest.qty
                }
            })
        }else{
             cart = await prisma.cart.create({
                data: {
                    product_id: createRequest.product_id,
                    qty: createRequest.qty,
                    user_id: createRequest.user_id
                }
            });

        }

        return toCartResponse(cart)
    }

    static async update(dto:updateCartRequest, id:number): Promise<cartResponse> {
        const updateRequest = Validation.validate(CartValidation.update, dto)

        const cartExist = await prisma.cart.findUnique({
            where: {
                id: id
            }
        });
        
        if(!cartExist) {
            throw new ResponseError("Cart not found", 404)
        }

        const productExist = await prisma.product.findUnique({
            where: {
                id: updateRequest.product_id
            }
        });
        
        if(!productExist) {
            throw new ResponseError("Product not found", 404)
        }

        const cart = await prisma.cart.update({
            where: {
                id: id
            },
            data: {
                qty: updateRequest.qty
            }
        });

        return toCartResponse(cart)
    }

    static async delete(id:number, userId:number): Promise<void> {
        const cartExist = await prisma.cart.findUnique({
            where: {
                id: id
            }
        });

        if(!cartExist) {
            throw new ResponseError("Cart not found", 404)
        }

         await prisma.cart.delete({
            where: {
                id: id
            }
        });

       
    }

    static async getById(id:number, userId:number): Promise<cartResponse> {
        const cart = await prisma.cart.findUnique({
            where: {
                id: id,
                user_id: userId
            },
            include: {
                product: true
            }
        });

        if(!cart) {
            throw new ResponseError("Cart not found", 404)
        }

        return toCartResponse(cart)
    }

    static async getAll(userId:number): Promise<cartResponse[]> {
        const carts = await prisma.cart.findMany({
            where:{
                user_id: userId
            },
            include:{
                product: true
            }
        });

        return carts.map(cart => toCartResponse(cart))
    }
}