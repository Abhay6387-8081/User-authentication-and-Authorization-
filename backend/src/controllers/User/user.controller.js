import crypto from "crypto";
import expressAsyncHandler from "express-async-handler";
import userModel from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResponse.util.js";
import CustomError from "../../utils/CustomError.util.js";
import { generateToken } from "../../utils/jwt.util.js";
import { sendEmail } from "../../utils/nodemailer.util.js";

export const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { username, email, password, contactNumber } = req.body;
  const newUser = await userModel.create({
    username,
    email,
    password,
    contactNumber,
  });

  let emailVerificationToken = newUser.generateEmailVerificationToken();
  await newUser.save();

  let verification_url = `http://localhost:9000/api/user/verify-email/${emailVerificationToken}`;
  //!send a mail-->
  await sendEmail(
    email,
    "Email Verification",
    "Sample Text",
    `<h1>this is for verification</h1> <a href="${verification_url}">Click Here </a> <h3> ${emailVerificationToken} </h3>`
  );
  new ApiResponse(201, "User Registered Successfully", newUser).send(res);
});

export const verifyEmail = expressAsyncHandler(async (req, res, next) => {
  let { emailToken } = req.params;
  let hashedEmailToken = crypto
    .createHash("sha256")
    .update(emailToken)
    .digest("hex");
    
  let user = await userModel.findOne({
    emailVerificationToken: hashedEmailToken,
    emailVerificationTokenExpiry: { $gt: Date.now() },
  });
  if (!user) return next(new CustomError(400, "token Expired"));

  if (user.isVerified) next(new CustomError(400, "Email Already Verified"));

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save();

  new ApiResponse(200, "Email verified Successfully").send(res);
});

export const loginUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser = await userModel.findOne({ email }).select("+password");

  if (!existingUser) next(new CustomError(400, "Email not Found!!!"));

  let matchPassword = await existingUser.comparePassword(password);

  if (!matchPassword) {
    // throw new customError(401,"Password not Matched")
    return next(new CustomError(401, "Password Not Matched"));
  }

  if (!existingUser.isVerified)
    next(new CustomError(400, "Email Not Verified"));

  //!is isVerified is set to true
  let token = generateToken(existingUser._id);
  res.cookie("token", token, {
    maxAge: process.env.JWT_TOKEN_EXPIRY * 60 * 60 * 1000,
    httpOnly: true,
  });

  new ApiResponse(200, "User Logged In Successfully").send(res);
});

export const resendEmailVerificationLink = expressAsyncHandler(
  async (req, res, next) => {
    const { email } = req.body;
    let existingUser = await userModel.findOne({ email });
    if (!existingUser) next(new CustomError(400, "Email Not Found"));

    if (existingUser.isVerified)
      next(new CustomError(400, "Email Already Verified"));

    let emailVerificationToken = existingUser.generateEmailVerificationToken();
    await existingUser.save();

    let verification_url = `http://localhost:9000/api/user/verify-email/${emailVerificationToken}`;

    //!send a mail-->
    await sendEmail(
      email,
      "Email Verification",
      "Resend Verification",
      `<h1>this is for verification</h1> <a href="${verification_url}">Click Here</a> <h3> ${emailVerificationToken} </h3>`
    );

    new ApiResponse(200, "Email Verification Link Sent Successfully").send(res);
  }
);

export const logoutUser = expressAsyncHandler(async (req, res, next) => {
  res.clearCookie("token");
  new ApiResponse(200, "User Logged Out Successfully").send(res);
});

export const currentUser = expressAsyncHandler(async (req, res, next) => {
  new ApiResponse(200, "User is Logged in").send(res);
});

export const updateProfile = expressAsyncHandler(async (req, res, next) => {
  //!excluding password,update rest
  const updatedUser = await userModel.findByIdAndUpdate(
    req.myUser._id,
    req.body,
    {
      new: true,
      //? it returns the updated document,
      runValidators: true, //?validate the updated document against the schema
    }
  );

  if (!updatedUser) next(new CustomError(404, "User Not Found"));
  new ApiResponse(200, "User Updated Successfully", updatedUser).send(res);
});

export const changePassword = expressAsyncHandler(async (req, res, next) => {
  const existingUser = await userModel.findById(req.myUser._id);

  existingUser.password = req.body.password;
  await existingUser.save();

  new ApiResponse(200, "Password Updated Successfully").send(res);
});

export const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let existingUser = await userModel.findOne({ email });
  
  if (!existingUser) next(new CustomError(400, "Email Not found"));
  let resetPasswordToken = await userModel.generateResetPasswordToken();
  await existingUser.save();

  let resetPassword_url = `http://localhost:9000/api/user/reset-password/${resetPasswordToken}`;

  await sendEmail(
    email,
    "Reset Password",
    "Reset Password",
    `<h1> this is for reset password</h1> <a href="${resetPassword_url}">Click Here</a> <h3>${resetPasswordToken}</h3>`
  );

  new ApiResponse(400, "Reset Link Sent Successfully").send(res);
});

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { resetPasswordToken } = req.params;
  let resetPasswordTokenHashed = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  const existingUser = await userModel.findOne({
    passwordResetToken: resetPasswordTokenHashed,
    passwordResetTokenExpiry: { $gt: Date.now() },
  });
  if (!existingUser) next(new CustomError(400, "Token Expired"));
  existingUser.password = req.body.password;
  await existingUser.save();
  new ApiResponse(200, "Password Reset Successfully").send(res);
});

//!login,logout->(token generation),authentication middleware
