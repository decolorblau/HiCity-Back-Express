import express from "express";
import { loginUser, userSingUp } from "../controllers/userController";

const router = express.Router();

router.post("/register", userSingUp);
router.post("/login", loginUser);

export default router;
