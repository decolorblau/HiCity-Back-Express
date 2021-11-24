import { Schema, model } from "mongoose";

const landmarkSchema = new Schema({
  title: {
    type: String,
    require: true,
    minlength: 1,
    maxlength: 30,
  },
  city: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  introduction: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    require: true,
  },
});
const landmarkModel = model("landmark", landmarkSchema, "landmarks");

export default landmarkModel;
