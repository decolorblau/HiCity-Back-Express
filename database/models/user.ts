import { Schema, model } from "mongoose";

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
    minlength: 8,
    maxlength: 30,
  },
});
const UserModel = model("User", userSchema, "Users");

export = { UserModel };
