import {
  porductResponse,
  searchProductRequest,
  toProductResponse,
} from "../model/product.model";
import { createProductRequest } from "../model/product.model";
import prisma from "../util/prisma";
import { ProductValidation } from "../validation/product.validation";
import { Validation } from "../validation/validation";
import { Request } from "express";
import fileUpload from "express-fileupload";
import { ResponseError } from "../error/response.error";
import path from "path";
import { Pageable } from "../model/page";

export class ProductService {
  static async create(
    dto: createProductRequest,
    req: Request
  ): Promise<porductResponse> {
    const productRequest = Validation.validate(ProductValidation.create, dto);

    const userExist = await prisma.user.findUnique({
      where: {
        id: productRequest.user_id,
      },
    });

    if (!userExist) {
      throw new ResponseError("User not found", 404);
    }

    let url = "";
    if (req.files) {
      const file = req.files.image as fileUpload.UploadedFile;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowType = [".png", ".jpg", ".jpeg"];
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      if (!allowType.includes(ext.toLowerCase())) {
        throw new ResponseError("Invalid Images", 422);
      }

      await new Promise<void>((resolve, reject) => {
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            reject(new ResponseError(err.message, 500));
          }
          resolve();
        });
      });
    }

    const product = await prisma.product.create({
      data: {
        image: url,
        name: productRequest.name,
        price: productRequest.price,
        description: productRequest.description,
        stock: productRequest.stock,
        user_id: productRequest.user_id,
      },
    });

    return toProductResponse(product);
  }

  static async getAll(
    dto: searchProductRequest
  ): Promise<Pageable<porductResponse>> {
    const searchRequest = Validation.validate(ProductValidation.search, dto);
    const skip = (searchRequest.page - 1) * searchRequest.size;
  
    const filters: any[] = [];
  
    if (searchRequest.name) {
      filters.push({
        name: {
          contains: searchRequest.name,
          mode: 'insensitive' 
        },
      });
    }
  
    if (searchRequest.min_price) {
      filters.push({
        price: {
          gte: searchRequest.min_price,
        },
      });
    }
  
    if (searchRequest.max_price) {
      filters.push({
        price: {
          lte: searchRequest.max_price,
        },
      });
    }
  
    if (searchRequest.price) {
      filters.push({
        price: searchRequest.price,
      });
    }
  
    if (searchRequest.description) {
      filters.push({
        description: {
          contains: searchRequest.description,
          mode: 'insensitive' 
        },
      });
    }
  
    const products = await prisma.product.findMany({
      where: {
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });
  
    return {
      data: products.map((product) => toProductResponse(product)),
      paging: {
        size: searchRequest.size,
        total_page: Math.ceil(products.length / searchRequest.size),
        current_page: searchRequest.page,
      },
    };
  }
  

  static getById = async (id: number) => {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new ResponseError("Product not found", 404);
    }
    return toProductResponse(product);
  };

  static async update(
    id: number,
    dto: createProductRequest,
    req: Request
  ): Promise<porductResponse> {
    const productRequest = Validation.validate(ProductValidation.update, dto);

    const productexist = await prisma.product.findUnique({
      where: { 
        id : id
       },
    });

    if (!productexist) {
      throw new ResponseError("Product not found", 404);
    }

    const userExist = await prisma.user.findUnique({
      where: {
        id: productRequest.user_id,
      },
    });

    if (!userExist) {
      throw new ResponseError("User not found", 404);
    }

    let url = "";
    if (req.files) {
      const file = req.files.image as fileUpload.UploadedFile;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowType = [".png", ".jpg", ".jpeg"];
      url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      if (!allowType.includes(ext.toLowerCase())) {
        throw new ResponseError("Invalid Images", 422);
      }

      await new Promise<void>((resolve, reject) => {
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            reject(new ResponseError(err.message, 500));
          }
          resolve();
        });
      });
    }

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        image: url,
        name: productRequest.name,
        price: productRequest.price,
        description: productRequest.description,
        stock: productRequest.stock,
        user_id: productRequest.user_id,
      },
    });
    return toProductResponse(product);
  }

  static async delete(id: number): Promise<void> {
    const productexist = await prisma.product.findUnique({
      where: { 
        id : id
       },
    });
    if (!productexist) {
      throw new ResponseError("Product not found", 404);
    }
    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    if (!product) {
      throw new ResponseError("Product not found", 404);
    }
  }
}
