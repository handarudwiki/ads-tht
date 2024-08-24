import { Role, User } from "@prisma/client"

export type LoginUserRequest = {
    email : string,
    password : string
}

export type RegisterUserRequest = {
    email : string,
    password : string,
    name : string, 
    address : string,
    phone_number : string,
    role? : string
}

export type userResponse = {
    id : number,
    name : string,
    email : string,
    address : string,
    phone_number : string,
    role : string
    avatar? : string
}

export type updateUserRequest = {
    email? : string,
    name? : string, 
    address? : string,
    phone_number? : string,
    role? : Role
}

export function toUserResponse(data : User) : userResponse{
    return {
        id : data.id,
        name : data.name,
        email : data.email,
        address : data.address,
        phone_number : data.phone_number,
        role : data.role,
        avatar : data.avatar!
    }
}

export function toLoginResponse(token : string) : string{
    return token
}