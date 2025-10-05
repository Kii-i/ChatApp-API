import express from "express";

import {
  myProfile,
  sendVerificationLink,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyLink,
} from "../controllers/user.controller";
const router = express.Router();
router.route("/me").patch(updateProfile).get(myProfile);
router.route("/update-password").patch(updatePassword);
router.route("/send-verification-link").get(sendVerificationLink);
router.route("/verify").get(verifyLink);
router.route("/update-email").patch(updateEmail);

export default router;
