import express from "express";
import { validate } from "express-validation";
import {
  getFolders,
  getUserFolder,
  createFolder,
} from "../controllers/folderController";
import folderSchemaValidator from "../schemas/folderSchema";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/allfolders", getFolders);
router.get("/", auth, getUserFolder);
router.post("/new", auth, validate(folderSchemaValidator), createFolder);

export default router;
