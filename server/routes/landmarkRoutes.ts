import express from "express";
import multer from "multer";
import path from "path";
import {
  createLandmark,
  getLandmarks,
} from "../controllers/landmarkController";
import auth from "../middlewares/auth";
import firebase from "../middlewares/firebase";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "images",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const oldFilenameWithoutExtension = oldFilename.replace(
        oldFilenameExtension,
        ""
      );

      const newFilename = `${oldFilenameWithoutExtension}-${Date.now()}-${oldFilenameExtension}`;
      callback(null, newFilename);
    },
  }),
});

router.get("/", getLandmarks);
router.post("/new", auth, upload.single("imageUrl"), firebase, createLandmark);

export default router;
