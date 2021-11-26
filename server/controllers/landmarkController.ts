import Debug from "debug";
import chalk from "chalk";
import LandmarkModel from "../../database/models/landMarks";
import FolderModel from "../../database/models/folder";

const debug = Debug("HiCity:landmark");
class NewError extends Error {
  code: number | undefined;
}

export const getLandmarks = async (req, res, next) => {
  try {
    const landmarks = await LandmarkModel.find();
    res.json(landmarks);
  } catch (error) {
    next(error);
  }
};

export const getLandmarkById = async (req, res, next) => {
  const { idLandmark } = req.params;
  try {
    const searchedLandmark = await LandmarkModel.findById(idLandmark);
    if (searchedLandmark) {
      res.json(searchedLandmark);
    } else {
      const error = new NewError("Landmark not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export const createLandmark = async (req, res, next) => {
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
      const error: any = new NewError("This landmark already exists");
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

export const editLandmark = async (req, res, next) => {
  const { idLandmark } = req.params;
  try {
    const { file } = req;
    if (file) {
      req.body.imageUrl = file.fileURL;
    }
    req.body.lastUpdate = Date.now();

    const landmark = await LandmarkModel.findById(idLandmark);
    if (!landmark) {
      const error = new NewError("Landmark not found.");
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

export const getFolderLandmark = async (req, res, next) => {
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

/* export const deleteFolderLandmark = async (req, res, next) => {
  try {
    const { idLandmark } = req.params;
    const deletedLandmark = await LandmarkModel.findByIdAndDelete(idLandmark);
    if (!deletedLandmark) {
      const error = new NewError("Landmark not found :(");
      error.code = 404;
      next(error);
    } else {
      await FolderModel.findByIdAndUpdate(
        { _id: req.folderId },
        { $pull: { landmarks: idLandmark } }
      );
      res.json(deletedLandmark);
    }
  } catch {
    const error = new NewError("Couldn't delete Landmark");
    error.code = 400;
    next(error);
  }
}; */

export const addFavouriteLandmark = async (req, res, next) => {};
