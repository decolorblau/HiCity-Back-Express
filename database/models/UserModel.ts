import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 30,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  folders: {
    type: [Schema.Types.ObjectId],
    ref: "folder",
    default: [],
  },
});
const UserModel = model("user", userSchema, "users");

export default UserModel;
