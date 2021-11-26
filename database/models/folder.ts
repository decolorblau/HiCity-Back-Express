import { Schema, model, Types } from "mongoose";

const folderSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 30,
    default: "the main folder",
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  landmarks: {
    type: [Types.ObjectId],
    ref: "landmark",
    default: [],
  },
  userId: {
    type: Types.ObjectId,
    ref: "user",
  },
});
const FolderModel = model("folder", folderSchema, "folders");

export default FolderModel;
