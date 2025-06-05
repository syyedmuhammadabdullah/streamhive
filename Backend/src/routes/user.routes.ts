import { Router, Request, Response } from "express";
import {
  userRegisterController,
  userLoginController,
  userRequestResetPasswordController,
  userVerifyPasswordOtpController,
  userResetPasswordController,
  userEnable2faController,
  userVerify2faController,
  userLogoutController,
  userChangeEmailController,
  userChangePasswordController,
  userChangeNameController,
} from "../controllers/userControllers";
import { authMiddleware } from "../middlewares";
const userRouter = Router();

// Define your user routes here

// register route for user registration
userRouter.post("/register", userRegisterController);

// login route for user login
userRouter.post("/login", userLoginController);

// request reset password route for user
userRouter.post("/request-reset-password", userRequestResetPasswordController);

// verify otp route for user
userRouter.post("/verify-otp", userVerifyPasswordOtpController);

// reset password route for user
userRouter.post("/reset-password", userResetPasswordController);

// enable 2FA route for user
userRouter.post("/enable-2fa", authMiddleware, userEnable2faController);

// verify 2FA route for user
userRouter.post("/verify-2fa", userVerify2faController);

// change email route for user
userRouter.patch("/change-email",authMiddleware, userChangeEmailController);

// change password route for user
userRouter.patch("/change-password",authMiddleware, userChangePasswordController);

// change name route for user
userRouter.patch("/change-name",authMiddleware, userChangeNameController);

// logout route for user
userRouter.post("/logout", userLogoutController);

// Example route to test if the user router is working
userRouter.get("/", (req: Request, res: Response) => {
  res.send("User route is working");
});
export default userRouter;
