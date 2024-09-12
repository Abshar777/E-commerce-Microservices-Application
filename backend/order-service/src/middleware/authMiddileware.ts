import { NextFunction, Request, Response } from "express";
import AsyncHandler from "express-async-handler";
import { AuthRequest } from "../types/api";
import Jwt from "../util/jwt";


const authMiddilware=AsyncHandler(async(req:AuthRequest,res:Response,next:NextFunction)=>{
    const token=req.cookies?.jwt ;
   
    if(!token){
        console.log('no token')
        res.status(400);
        throw new Error("unothriezed user and user dont have token")
    }else{
        const jwt=new Jwt();
        const {payload:{userId}}=await jwt.verifyToken(token);
        req.user=userId
        next();
    }
})

export default authMiddilware