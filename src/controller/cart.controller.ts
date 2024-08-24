import { NextFunction, Request, Response } from "express"
import { createCartRequest, updateCartRequest } from "../model/cart.model"
import { UserRequest } from "../type/user.request"
import { CartService } from "../service/cart.service"

export class CartController{
    static async  addToCart(req:UserRequest, res:Response, next:NextFunction) {
        try{
            
            const dto:createCartRequest = {
                product_id : req.body.product_id,
                qty : req.body.qty,
                user_id : req.user?.id!
            }
            const cart = await CartService.addToCart(dto);
            res.status(200).json({
                status : 'success',
                data: cart
            });


        }catch(err){
            next(err)
        }
    }

    static async updateCart(req:UserRequest, res:Response, next:NextFunction) {
        try{
            const dto:updateCartRequest = {
                product_id : req.body.product_id,
                qty : req.body.qty,
                user_id : req.user?.id!
            }
            const id = parseInt(req.params.id)
            const cart = await CartService.update(dto, id);
            res.status(200).json({
                status : 'success',
                data: cart
            });
        }catch(err){
            next(err)
        }
    }

    static async deleteCart(req:UserRequest, res:Response, next:NextFunction) {
        try{
            const id = parseInt(req.params.id)
            const cart = await CartService.delete(id, req.user?.id!);
            res.status(200).json({
                status : 'success',
                data: "Cart item deleted successfully"
            });
        }catch(err){
            next(err)
        }
    }

    static async getById(req:UserRequest, res:Response, next:NextFunction) {
        try{
            const id = parseInt(req.params.id)
            const cart = await CartService.getById(id, req.user?.id!);
            res.status(200).json({
                status : 'success',
                data: cart
            });
        }catch(err){
            next(err)
        }
    }

    static async getAll(req:UserRequest, res:Response, next:NextFunction) {
        try{
            const carts = await CartService.getAll(req.user?.id!);
            res.status(200).json({
                status : 'success',
                data: carts
            });
        }catch(err){
            next(err)
        }
    }
}