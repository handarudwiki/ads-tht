import { UserRequest } from './../type/user.request';
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from '../error/response.error';

export const errorMiddleware = (error:Error,  req: Request, res: Response, next: NextFunction) => {
    if(error instanceof ZodError){
        res.status(400).json({
            status : 'error',
            message: 'Validation Error',
            details : error.errors.map(err => err.message+ " at " + err.path.join(' '))
        })
    }else if(error instanceof ResponseError){
        res.status(error.statusCode).json({
            status : 'error',
            message: error.message
        })
    }else{
        res.status(500).json({
            status : 'error',
            message: error.message
        })
    }
}


