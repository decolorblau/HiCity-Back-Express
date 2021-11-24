import express from "express";
import getLandmarks from "../controllers/landmarkController";

const router = express.Router();

router.get("/", getLandmarks);
router.post("/new", getLandmarks);

export default router;
