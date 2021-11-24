import express from "express";
import {
  createLandmark,
  getLandmarks,
} from "../controllers/landmarkController";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/", getLandmarks);
router.post("/new", auth, createLandmark);

export default router;
