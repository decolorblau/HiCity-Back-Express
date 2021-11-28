import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Response } from "express";
import RequestAuth from "../../interfaces/RequestAuth";
import LandmarkModel from "../../database/models/LandmarkModel";
import FolderModel from "../../database/models/FolderModel";
import IErrorValidation from "../../interfaces/IError";

const debug = Debug("HiCity:landmark");

export const getLandmarks = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const landmarks = await LandmarkModel.find();
    res.json(landmarks);
  } catch (error) {
    next(error);
  }
};

export const getLandmarkById = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const { idLandmark } = req.params;
  try {
    const searchedLandmark = await LandmarkModel.findById(idLandmark);
    if (searchedLandmark) {
      res.json(searchedLandmark);
    } else {
      const error = new Error("Landmark not found") as IErrorValidation;
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export const createLandmark = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const image = req.file ? req.file : { fileURL: "" };
  const {
    title,
    city,
    category,
    latitude,
    longitude,
    lastUpdate,
    introduction,
    description,
  } = req.body;

  try {
    const landmark = await LandmarkModel.findOne({ latitude, longitude });

    if (landmark) {
      const error = new Error(
        "This landmark already exists"
      ) as IErrorValidation;

      debug(chalk.red(error.message));
      error.code = 400;
      next(error);
    } else {
      const newLandmark = await LandmarkModel.create({
        title,
        city,
        imageUrl: image.fileURL,
        category,
        latitude,
        longitude,
        lastUpdate,
        introduction,
        description,
      });
      res.status(201);
      res.json(newLandmark);
      debug(chalk.green("Landmark created correctly"));
    }
  } catch (error) {
    error.code = 400;
    error.message = "Ouch! This is not a landmark!";
    debug(chalk.red(error.message));
    next(error);
  }
};

export const updateLandmark = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const { idLandmark } = req.params;
  try {
    const { file } = req;
    if (file) {
      req.body.imageUrl = file.fileURL;
    }
    req.body.lastUpdate = Date.now();

    const landmark = await LandmarkModel.findById(idLandmark);
    if (!landmark) {
      const error = new Error("Landmark not found.") as IErrorValidation;
      error.code = 404;
      next(error);
    } else {
      const newLandmark = await LandmarkModel.findByIdAndUpdate(
        idLandmark,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json(newLandmark);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Ouch! This is not a landmark!";
    debug(chalk.red(error.message));
    next(error);
  }
};

export const getFolderLandmark = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const folderLandmarks = await FolderModel.findById(req.idFolder).populate(
      "landmarks"
    );
    res.json(folderLandmarks.landmarks);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get landmarks";
    next(error);
  }
};

export const addFavoriteLandmark = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLandmark } = req.params;
    const { id } = req.userData;
    const landmark = await LandmarkModel.findOne({ id: idLandmark });
    const userFolder = await FolderModel.findOne({ userId: id });

    if (userFolder && landmark) {
      if (userFolder.landmarks.includes(idLandmark)) {
        const error = new Error(
          "The landmark already includes this landmark"
        ) as IErrorValidation;
        error.code = 409;
        next(error);
      } else {
        userFolder.landmarks = [...userFolder.landmarks, idLandmark];
        await userFolder.save();
        res.status(200).json(userFolder);
      }
    } else {
      const error = new Error("Folder not Found") as IErrorValidation;
      debug(chalk.red(error.message));
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error(
      "Error adding favorite Landmark"
    ) as IErrorValidation;

    debug(chalk.red(error.message));
    error.code = 400;
    next(error);
  }
};

export const deleteFavoriteLandmark = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idLandmark } = req.params;
    const { id } = req.userData;
    const userFolder = await FolderModel.findOne({ userId: id });
    const deleteLandmark = await LandmarkModel.findOne({
      _id: idLandmark,
    });

    if (deleteLandmark) {
      if (userFolder.landmarks.includes(idLandmark)) {
        const userFolderId = userFolder.id;
        await FolderModel.findByIdAndUpdate(userFolderId, {
          $pull: { landmarks: idLandmark },
        });
        userFolder.save();
        res.json(deleteLandmark);
      } else {
        const error = new Error(
          "Error: could't find the landmark in your folders"
        ) as IErrorValidation;
        error.code = 404;
        next(error);
      }
    } else {
      const error = new Error("Landmark not found") as IErrorValidation;
      error.code = 404;
      next(error);
    }
  } catch {
    const error = new Error(
      "Error: couldn't delete favorite landmark"
    ) as IErrorValidation;
    debug(chalk.red(error.message));
    error.code = 400;
    next(error);
  }
};
