import express from "express";
import {
  createLandmark,
  getLandmarks,
  getLandmarkById,
} from "../controllers/landmarkController";
import auth from "../middlewares/auth";
import firebase from "../middlewares/firebase";
import uploadImage from "../middlewares/uploadImage";

const router = express.Router();

router.get("/", getLandmarks);
router.get("/:idLandmark", getLandmarkById);
router.post(
  "/new",
  uploadImage.single("imageUrl"),
  firebase,
  auth,
  createLandmark
);

export default router;
