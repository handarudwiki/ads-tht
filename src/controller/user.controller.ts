import { NextFunction, Request, Response } from "express";
import { LoginUserRequest, RegisterUserRequest, updateUserRequest } from "../model/user.model";
import { UserService } from "../service/user.service";
import { UserRequest } from "../type/user.request";

export class UserController{
    static async register(req:Request, res:Response, next: NextFunction){
        try{
            const dto = req.body as RegisterUserRequest
            const user = await UserService.register(dto, req);
           
            res.status(200).json({
                status : 'success',
                data: user
            });
        }catch(err){
            next(err)
        }
    }

    static async login(req:Request, res:Response, next: NextFunction){
        try{
            const dto = req.body as LoginUserRequest
            const token = await UserService.login(dto, res);
            res.status(200).json({
                status : 'success',
                token
            });
            
        }catch(err){
            next(err)
        }
    }

    static async logout(req:Request, res:Response, next: NextFunction){
        try{
            res.clearCookie('token')
            res.status(200).json({
                status : 'success',
                message : 'Logout success'
            });
        }catch(err){
            next(err)
        }
    }
    static async update(req:UserRequest, res:Response, next: NextFunction){
        try{
            const dto = req.body as updateUserRequest
            const user = await UserService.update(dto, req.user?.id!,req);
            res.status(200).json({
                status : 'success',
                data: user
            });
        }catch(err){
            next(err)
        }
    }
}