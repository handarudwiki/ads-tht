import { z, ZodType } from 'zod';
export class TransactionValidation{
    static readonly checkout: ZodType = z.object({
        'user_id' : z.number().positive(),
        'qty' : z.number().positive(), 
        'product_id' : z.number().positive(),
    })
    static readonly update: ZodType = z.object({
        'status' : z.enum(['Pending', 'Success', 'Failed']),
        'id' : z.number().positive()
    })

    static readonly checkoutSomeInCart: ZodType = z.object({
        "itemIds" : z.array(
            z.number().positive(),
        ).nonempty(),
        "user_id" : z.number().positive(),
    })

}