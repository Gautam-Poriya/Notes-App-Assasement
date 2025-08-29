const express = require("express");
const router = express.Router();
// import {authController} from "../controllers/auth.controller";
import { Router } from "express";
import {
  signupStart,
  signupVerify,
  signinStart,
  signinVerify,
  me,
} from "../controllers/auth.controller";

// // POST /signin
// router.post("/singup", authController.signupStart);
// // GET /home
// router.get("/signin", authController.home);




// ✅ Signup flow
router.post("/auth/signup/start", signupStart);
router.post("/auth/signup/verify", signupVerify);

// ✅ Signin flow
router.post("/auth/signin/start", signinStart);
router.post("/auth/signin/verify", signinVerify);

// ✅ Get current user
router.get("/auth/me", me);

export default router;


module.exports = router; 