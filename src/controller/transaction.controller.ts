import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user.request";
import { checkOutByCartRequest, checkoutRequest, transactionUpdateRequest } from "../model/transaction.model";
import { TransactionService } from "../service/transaction.service";
import { Status } from "@prisma/client";


export class TransactionController {
    static async checkoutDirect(req:UserRequest, res:Response, next:NextFunction){
        try {
            const dto:checkoutRequest = {
                product_id : req.body.product_id,
                qty : req.body.qty,
                user_id : req.user?.id!
            }

            const transaction = await TransactionService.checkoutDirect(dto)
            return res.status(200).json({
                status : "success",
                data : transaction
            })
        } catch (error) {
            next(error)
        }
    }
    static async checkoutBycart(req:UserRequest, res:Response, next:NextFunction){
        try {
            const dto:checkOutByCartRequest = {
               itemIds : req.body.itemIds,
               user_id : req.user?.id!
            }

            const transaction = await TransactionService.checkOutByCart(dto)
            return res.status(200).json({
                status : "success",
                data : transaction
            })
        } catch (error) {
            next(error)
        }
    }
    static async getTransactionsForCustomers(req:UserRequest, res:Response, next:NextFunction){
        try {
            const userId = req.user?.id!

            const transaction = await TransactionService.getTransactionForCustomer(userId)
            return res.status(200).json({
                status : "success",
                data : transaction
            })
        } catch (error) {
            next(error)
        }
    }
    static async getTransactionsForSeller(req:UserRequest, res:Response, next:NextFunction){
        try {
            const userId = req.user?.id!

            const transaction = await TransactionService.getTransactionForSeler(userId)
            return res.status(200).json({
                status : "success",
                data : transaction
            })
        } catch (error) {
            next(error)
        }
    }
    static async update(req:UserRequest, res:Response, next:NextFunction){
        try {
            const dto:transactionUpdateRequest = {
                id : parseInt(req.params.id),
                status : req.body.status as Status
            }

            const transaction = await TransactionService.update(dto)
            return res.status(200).json({
                status : "success",
                data : transaction
            })
        } catch (error) {
            next(error)
        }
    }
}