import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
            unique:false,
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
        },
        _id:false,
    }],

    expiresAt:{
        type:Date,
        default:()=>Date.now() + 7*24*60*60*1000,//7 days
    },
},{
    timestamps:true,
});


// TTL Index for automatic cart cleanup
CartSchema.index({expiresAt:1},{expireAfterSeconds:0});

const CartModel = mongoose.model("Cart",CartSchema);

export default CartModel;