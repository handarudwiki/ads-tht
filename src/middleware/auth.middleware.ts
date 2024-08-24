import  jwt  from 'jsonwebtoken';
import { NextFunction, Response } from "express";
import { ResponseError } from "../error/response.error";
import dotenv from 'dotenv'
import prisma from '../util/prisma';
import { UserRequest } from '../type/user.request';

dotenv.config()

export const authMiddleware = async(req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if(!token){
        return  next(new ResponseError('unauthorized',401))
    }


    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as any

    if(!userId){
        return next(new ResponseError('unauthorized',401))
    }

    const user = await prisma.user.findUnique({
        where:{
            id: userId
        }
    })

    if(!user){
        return next(new ResponseError('unauthorized',401))
    }

    req.user = user
    return next()
}

export const authorizeRole = (...roles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ResponseError('Forbidden: You do not have the required permissions', 403));
        }
        return next();
    };
};