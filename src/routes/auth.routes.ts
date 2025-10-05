import express from "express";
import {
  login,
  logout,
  logoutFromAllDevice,
  passwordReset,
  refresh,
  register,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller";
import authentication from "../middlewares/authentication.Error";
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(authentication, logout);
router.route("/logoutFromAllDevice").post(authentication, logoutFromAllDevice);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(passwordReset);

export default router;
