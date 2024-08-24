import { z, ZodType } from "zod";

export class UserValidation{
    static readonly register:ZodType = z.object({
        'name' : z.string().min(3).max(255),
        'email' : z.string().email(),
        'password' : z.string().min(6).max(255),
        'phone_number' : z.string().min(10).max(13),
        'role' : z.enum(['Seller', 'Customer']),
        'address' : z.string().min(3).max(255),
    })

    static readonly login:ZodType = z.object({
        'email' : z.string().email(),
        'password' : z.string().min(6).max(255)
    })

    static readonly update:ZodType = z.object({
        'name' : z.string().min(3).max(255).optional(),
        'email' : z.string().email().optional(),
        'password' : z.string().min(6).max(255).optional(),
        'phone_number' : z.string().min(10).max(13).optional(),
        'role' : z.enum(['Seller', 'Customer']).optional(),
        'address' : z.string().min(3).max(255).optional(),
    })
}