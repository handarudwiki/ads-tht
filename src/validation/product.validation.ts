import { z, ZodType } from "zod";

export class ProductValidation{
    static readonly create:ZodType = z.object({
        'name' : z.string().min(3).max(255),
        'price' : z.number().positive(),
        'stock' : z.number().positive(),
        'description' : z.string().min(3).max(255),
        'user_id' : z.number().positive(),
    })
    static readonly update:ZodType = z.object({
        'name' : z.string().min(3).max(255),
        'price' : z.number().positive(),
        'stock' : z.number().positive(),
        'description' : z.string().min(3).max(255),
        'user_id' : z.number().positive(),
    })

    static readonly search:ZodType = z.object({
        'name' : z.string().optional(),
        'min_price' : z.number().optional(),
        'max_price' : z.number().optional(),
        'price' : z.number().optional(),
        'description' : z.string().optional(),
        'page': z.number().positive(),
        'size': z.number().positive(),
    })

}