import express from "express";
import { validate } from "express-validation";
import { getUsers, loginUser, userSingUp } from "../controllers/userController";
import {
  loginSchemaValidator,
  registerSchemaValidator,
} from "../schemas/userSchema";

const router = express.Router();

router.post("/register", validate(registerSchemaValidator), userSingUp);
router.post("/login", validate(loginSchemaValidator), loginUser);
router.get("/users", getUsers);

export default router;
