import { Schema, model, Types } from "mongoose";

const folderSchema = new Schema({
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
    default: [],
  },
});
const FolderModel = model("folder", folderSchema, "folders");

export = { FolderModel };
