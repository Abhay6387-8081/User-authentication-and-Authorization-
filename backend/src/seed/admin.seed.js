import userModel from "../models/user.model.js";

export const seedAdmin = async () => {
  let existingAdmin = await userModel.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin Already Exists,skipping seed...");
    return;
  }

  let adminDetails = {
    email: "admin@example.com",
    password: "Abhay@6387",
    username: "AdminName",
    role: "admin",
    contactNumber: 1234567898,
    isVerified: true,
  };
  

  await new userModel(adminDetails).save();
  console.log("Admin Details Added to DB..");
};
