const { Schema, model, Types } = require("mongoose");

interface Folder {
  name: string;
  userId: number;
  creationDate: number | String;
  listLandmarks: Array<number>;
}

const folderSchema: Folder = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 30,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    require: true,
  },
  listsLandmarks: {
    type: [Types.ObjectId],
    ref: "Landmark",
  },
});
const FolderModel = model("User", folderSchema, "Users");

export = { FolderModel };
