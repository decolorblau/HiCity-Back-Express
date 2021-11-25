/* import Debug from "debug"; */
/* import chalk from "chalk"; */
import FolderModel from "../../database/models/folder";
import UserModel from "../../database/models/user";

/* const debug = Debug("HiCity:folder"); */

/* class NewError extends Error {
  code: number | undefined;
} */

export const getFolders = async (req, res, next) => {
  try {
    const folders = await FolderModel.find();
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

export const getUserFolders = async (req, res, next) => {
  try {
    const userFolders = await UserModel.findById(req.id).populate("folders");
    res.json(userFolders);
  } catch (error) {
    error.code = 400;
    error.message = "Could not get folders";
    next(error);
  }
};
