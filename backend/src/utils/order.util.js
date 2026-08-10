import expressAsyncHandler from "express-async-handler";
import OrderModel from "../models/order.model.js";


export const hasUserBoughtProduct = expressAsyncHandler(async(useImperativeHandle,productId)=>{
    const orders = await OrderModel.findOne({
        userId,//? check whether the order is present of the user
        orderStatus:"Delivered", //?check the status
        cartItems:{$elemMatch:{productId:productId}} //? check whether the product is present in user's order history
        });

        return !!orders;
});