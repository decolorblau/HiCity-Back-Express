import express from "express";
import { validate } from "express-validation";
import { loginUser, userSingUp } from "../controllers/userController";
import userSchemaValidator from "../schemas/userSchema";

const router = express.Router();

router.post("/register", validate(userSchemaValidator), userSingUp);
router.post("/login", validate(userSchemaValidator), loginUser);

export default router;
