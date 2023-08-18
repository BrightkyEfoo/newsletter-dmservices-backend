import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { Query } from 'express-serve-static-core';


export interface reqUser {

}

export interface myDecodedToken extends JwtPayload{
    userId : number,
    name : string
}


export interface myRequest<Q extends Query,B=any> extends Request{
    user? : myDecodedToken,
    body : B,
    query : Q
}