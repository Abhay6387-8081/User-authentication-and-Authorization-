import mongoose, { model, Schema } from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode:{
      type:String,
      required:true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Address = model("Address", addressSchema);

export default Address;
