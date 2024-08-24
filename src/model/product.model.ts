import { Product } from "@prisma/client"

export type createProductRequest = {
    name : string,
    price : number,
    description : string,
    stock : number,
    user_id : number
}
export type upateProductRequest = {
    name : string,
    price : number,
    description : string,
    stock : number,
    user_id : number
}

export type porductResponse = {
    id : number,
    name : string,
    price : number,
    description : string,
    stock : number,
    user_id : number,
    image?: string
}

export type searchProductRequest = {
    name? : string,
    min_price? : number,
    max_price? : number,
    price? : number,
    description? : string,
    page : number,
    size : number
}

export function toProductResponse(data : Product) : porductResponse{
    return {
        id : data.id,
        name : data.name,
        price : data.price,
        description : data.description!,
        stock : data.stock,
        user_id : data.user_id,
        image : data.image
    }
}