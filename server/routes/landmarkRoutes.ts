import express from "express";
import getLandmarks from "../controllers/landmarkController";

const router = express.Router();

router.get("/", getLandmarks);

export default router;
