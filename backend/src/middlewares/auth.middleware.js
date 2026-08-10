//!day-2

import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import CustomError from "../utils/CustomError.util.js";

export const authenticate = expressAsyncHandler(async(req,res,next)=>{
    const token = req?.cookies?.token;
    // console.log(token);
    
    if(!token) next(new CustomError(401,"Please login to access this route"));

    const decodeToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decodeToken.id);
    if(!user) next(new CustomError(401,"Invalid Session, Please login again"));

    req.myUser = user;
    next();
});

export const authorize = expressAsyncHandler(async(req,res,next)=>{
    if(req.myUser.role==="admin") next();
    else
        next(new CustomError(403,"You are not authorized to access this route"));
})