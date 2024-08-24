import { Request, Response } from "express";
import { ResponseError } from "../error/response.error";
import {
  LoginUserRequest,
  RegisterUserRequest,
  toLoginResponse,
  toUserResponse,
  updateUserRequest,
  userResponse,
} from "../model/user.model";
import prisma from "../util/prisma";
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcryptjs";
import path from "path";
import fileUpload from "express-fileupload";
import { generateToken } from "../util/jwt";

export class UserService {
  static async register(
    dto: RegisterUserRequest,
    req: Request
  ): Promise<userResponse> {
    const registerRequest = Validation.validate(UserValidation.register, dto);

    const emailAndPhoneExist = await prisma.user.findUnique({
      where: {
        email: registerRequest.email,
        phone_number: registerRequest.phone_number,
      },
    });

    if (emailAndPhoneExist) {
      throw new ResponseError("User already exists", 400);
    }

    let avatarUrl = "";
    if (req.files && req.files.avatar) {
      const file = req.files.avatar as fileUpload.UploadedFile;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowType = [".png", ".jpg", ".jpeg"];
      avatarUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      if (!allowType.includes(ext.toLowerCase())) {
        throw new ResponseError("Invalid image type", 422);
      }

      try {
        await new Promise<void>((resolve, reject) => {
          file.mv(`./public/images/${fileName}`, (err) => {
            if (err) {
              return reject(new ResponseError(err.message, 500));
            }
            resolve();
          });
        });
      } catch (error) {
        throw new ResponseError("Error uploading image", 500);
      }
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await prisma.user.create({
      data: {
        address: registerRequest.address,
        email: registerRequest.email,
        name: registerRequest.name,
        password: registerRequest.password,
        phone_number: registerRequest.phone_number,
        role: registerRequest.role === "Seller" ? "Seller" : "Customer",
        avatar: avatarUrl,
      },
    });

    return toUserResponse(user);
  }

  static async login(dto: LoginUserRequest, res: Response): Promise<string> {
    const loginRequest = Validation.validate(UserValidation.login, dto);

    const user = await prisma.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new ResponseError("Email or password is wrong", 401);
    }

    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!passwordMatch) {
      throw new ResponseError("Email or password is wrong", 401);
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    });
    return toLoginResponse(token);
  }

  static async update(
    dto: updateUserRequest,
    id: number,
    req: Request
  ): Promise<userResponse> {
    const updateRequest = Validation.validate(UserValidation.update, dto);

    const userExist = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userExist) {
      throw new ResponseError("User not found", 404);
    }

    let avatarUrl = "";
    if (req.files && req.files.avatar) {
      const file = req.files.avatar as fileUpload.UploadedFile;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const allowType = [".png", ".jpg", ".jpeg"];
      avatarUrl = `${req.protocol}://${req.get("host")}/images/${fileName}`;

      if (!allowType.includes(ext.toLowerCase())) {
        throw new ResponseError("Invalid image type", 422);
      }

      try {
        await new Promise<void>((resolve, reject) => {
          file.mv(`./public/images/${fileName}`, (err) => {
            if (err) {
              return reject(new ResponseError(err.message, 500));
            }
            resolve();
          });
        });
      } catch (error) {
        throw new ResponseError("Error uploading image", 500);
      }
    }

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: updateRequest.email,
        name: updateRequest.name,
        address: updateRequest.address,
        phone_number: updateRequest.phone_number,
        role: updateRequest.role!,
        avatar: avatarUrl,
      },
    });

    return toUserResponse(user);
  }
}
