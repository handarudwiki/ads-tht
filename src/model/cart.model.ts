import { Product,Cart } from "@prisma/client"


export type createCartRequest ={
    product_id : number,
    qty : number,
    user_id : number,
}
export type updateCartRequest ={
    product_id : number,
    qty : number,
    user_id : number,
}

type product  = {
    id : number,
    name : string,
    price : number,
    description : string,
    stock : number,
    user_id : number
}

export type cartResponse = {
    id : number,
    product_id? : number,
    quantity : number,
    user_id : number,
    product?: Product
}

export function toCartResponse(cart: Cart & { product?: Product }):cartResponse{
    return {
        id : cart.id,
        product_id : cart.product_id,
        quantity : cart.qty,
        user_id : cart.user_id,
        product : cart.product
    }
}