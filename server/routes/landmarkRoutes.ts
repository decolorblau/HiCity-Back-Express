import express from "express";
import { validate } from "express-validation";
import {
  createLandmark,
  getLandmarks,
  getLandmarkById,
  editLandmark,
} from "../controllers/landmarkController";
import auth from "../middlewares/auth";
import firebase from "../middlewares/firebase";
import uploadImage from "../middlewares/uploadImage";
import landmarkSchemaValidator from "../schemas/landmarkSchema";

const router = express.Router();

router.get("/", getLandmarks);
router.get("/:idLandmark", getLandmarkById);
router.post(
  "/new",
  uploadImage.single("imageUrl"),
  firebase,
  auth,
  validate(landmarkSchemaValidator),
  createLandmark
);
router.put(
  "/:idLandmark",
  uploadImage.single("imageUrl"),
  firebase,
  auth,
  validate(landmarkSchemaValidator),
  editLandmark
);

export default router;
