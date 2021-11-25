/* import Debug from "debug"; */
/* import chalk from "chalk"; */
import FolderModel from "../../database/models/folder";

/* const debug = Debug("HiCity:folder"); */

/* class NewError extends Error {
  code: number | undefined;
} */

const getFolders = async (req, res, next) => {
  try {
    const folders = await FolderModel.find();
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

export default getFolders;
