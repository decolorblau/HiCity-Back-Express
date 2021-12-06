import express from "express";
import { validate } from "express-validation";
import {
  createLandmark,
  getLandmarks,
  getLandmarkById,
  updateLandmark,
  addFavoriteLandmark,
  deleteFavoriteLandmark,
  deleteLandmark,
} from "../controllers/landmarkController";
import auth from "../middlewares/auth";
import firebase from "../middlewares/firebase";
import uploadImage from "../middlewares/uploadImage";
import {
  landmarkCreateSchema,
  landmarkEditSchema,
} from "../schemas/landmarkSchema";

const router = express.Router();

router.get("/", getLandmarks);
router.get("/:idLandmark", getLandmarkById);
router.post(
  "/new",
  uploadImage.single("imageUrl"),
  firebase,
  auth,
  validate(landmarkCreateSchema),
  createLandmark
);
router.put(
  "/:idLandmark",
  uploadImage.single("imageUrl"),
  firebase,
  auth,
  validate(landmarkEditSchema),
  updateLandmark
);

router.delete("/:idLandmark", auth, deleteLandmark);
router.patch("/favorite/add/:idLandmark", auth, addFavoriteLandmark);
router.patch("/favorite/delete/:idLandmark", auth, deleteFavoriteLandmark);

export default router;
