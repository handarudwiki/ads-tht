import { NextFunction, Request, Response } from "express";
import {
  createProductRequest,
  searchProductRequest,
  upateProductRequest,
} from "../model/product.model";
import { ProductService } from "../service/product.service";
import { UserRequest } from "../type/user.request";

export class ProductController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const dto: createProductRequest = {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        stock: parseInt(req.body.stock),
        user_id: req.user?.id!,
      };
      const product = await ProductService.create(dto, req);

      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (err) {
        console.log(err)
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const dto: upateProductRequest = {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price),
        stock: parseInt(req.body.stock),
        user_id: req.user?.id!,
      };
      const id = parseInt(req.params.id);
      const product = await ProductService.update(id, dto, req);
      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const dto: searchProductRequest = {
            name: req.query.name as string,
            description: req.query.description as string,
            price: req.query.price ? Number(req.query.price) : undefined,
            min_price: req.query.min_price ? Number(req.query.min_price) : undefined,
            max_price: req.query.max_price ? Number(req.query.max_price) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            size: req.query.size ? Number(req.query.size) : 10,
        };
      const products = await ProductService.getAll(dto);
      res.status(200).json({
        status: "success",
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await ProductService.delete(id);
      res.status(200).json({
        status: "success",
        message : "Product deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const product = await ProductService.getById(id);
      res.status(200).json({
        status: "success",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
}
