import Debug from "debug";
import chalk from "chalk";
import FolderModel from "../../database/models/folder";
import UserModel from "../../database/models/user";
import LandmarkModel from "../../database/models/landMarks";

const debug = Debug("HiCity:folder");

class NewError extends Error {
  code: number | undefined;
}

export const getFolders = async (req, res, next) => {
  try {
    const folders = await FolderModel.find();
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

export const getUserFolder = async (req, res, next) => {
  const { id } = req.userData;
  try {
    const userFolders = await UserModel.findById(id).populate("folders");
    res.json(userFolders.folders);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get folders";
    next(error);
  }
};

export const getUserFolderById = async (req, res, next) => {
  const { idFolder } = req.params;
  try {
    const searchedFolder = await FolderModel.findById(idFolder);
    const folderUserId = searchedFolder.userId;
    const { id } = req.userData;

    if (folderUserId.toString() === id) {
      res.json(searchedFolder);
    } else {
      const error = new NewError("Folder not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    next(error);
  }
};

export const createFolder = async (req, res, next) => {
  const { id } = req.userData;
  const { name } = req.body;

  try {
    const user = await UserModel.findById(id);
    const folder = await FolderModel.findOne({ name });
    const folderUserId = folder ? folder.userId : null;

    if (folder && folderUserId.toString() === id) {
      const error = new NewError("This folder already exist");
      debug(chalk.red(error.message));
      error.code = 406;
      next(error);
    } else {
      const newFolder = await FolderModel.create({ name, userId: id });
      res.status(201).json(newFolder);
      user.folders.push(newFolder.id);
      user.save();
    }
  } catch {
    const error = new NewError("Error creating the folder");
    debug(chalk.red(error.message));
    error.code = 400;
    next(error);
  }
};
