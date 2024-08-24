import { z, ZodType } from "zod"

export class CartValidation{
    
    static readonly create:ZodType = z.object({
        'product_id' : z.number().positive(),
        'qty' : z.number().positive(),
        'user_id' : z.number().positive()
    })

    static readonly update:ZodType = z.object({
        'product_id' : z.number().positive(),
        'qty' : z.number().positive(),
        'user_id' : z.number().positive()
    })
}