import Debug from "debug";
import chalk from "chalk";
import FolderModel from "../../database/models/folder";
import UserModel from "../../database/models/user";

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

export const createFolder = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.userData;

  try {
    const user = await UserModel.findById(id);
    const newFolder = await FolderModel.create({ name, userId: id });
    user.folders.push(newFolder.id);

    user.save();
    res.status(201).json(newFolder);
  } catch {
    const error = new NewError("Error creating the folder");
    debug(chalk.red(error.message));
    next(error);
  }
};
