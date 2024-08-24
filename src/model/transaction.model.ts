import { Product, Status, Transaction, TransactionItem, User } from "@prisma/client";

export type checkoutRequest = {
  user_id: number;
  product_id: number;
  qty: number;
};

export type checkoutResponse = {
  id: number;
  user_id: number;
  total_price: number;
  platform_fee: number;
  transaction_item: TransactionItem[];
  status: Status;
  created_at: Date;
  updated_at: Date;
};

export type checkOutByCartRequest = {
  user_id: number;
  itemIds: number[];
};

export type transactionForSelerResponse = {
  id: number;
  user: User;
  total_price: number;
  platformfee: number;
  transaction_items: (TransactionItem & { product: Product })[];
  status: Status;
  created_at: Date;
  updated_at: Date;
};

export type transactionUpdateRequest = {
  status: Status;
  id: number;
};

export type transactuonForCustomerResponse = {
  id: number;
  user_id: number;
  total_price: number;
  platformfee: number;
  transaction_items: (TransactionItem & { product: Product })[];
  status : Status;
  created_at: Date;
  updated_at: Date;
};

export function toTransactionForCustomerResponse(data: Transaction & {
    items: (TransactionItem & { product: Product })[];
  }): transactuonForCustomerResponse{

    return{
        id:data.id,
        user_id : data.user_id,
        platformfee: data.platformFee,
        total_price: data.grandTotal,
        transaction_items : data.items,
        status : data.status,
        created_at:data.createdAt,
        updated_at:data.updatedAt
    }
}

export function toTransactionForSelerResponse(
  data: Transaction & {
    items: (TransactionItem & { product: Product })[];
    user: User;
  }
): transactionForSelerResponse {
  return {
    id: data.id,
    user: data.user,
    platformfee: data.platformFee,
    total_price: data.grandTotal,
    transaction_items: data.items,
    status: data.status,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
  };
}

export function toCheckoutResponse(
  data: Transaction & { items: TransactionItem[] }
): checkoutResponse {
  return {
    id: data.id,
    user_id: data.user_id,
    platform_fee: data.platformFee,
    total_price: data.grandTotal,
    transaction_item: data.items,
    status: data.status,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
  };
}
