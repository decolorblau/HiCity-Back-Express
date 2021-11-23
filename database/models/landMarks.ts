const { Schema, model } = require("mongoose");

interface Landmark {
  title: string;
  city: string;
  imageUrl: string;
  category: string;
  lastUpdate: number | String;
  introduction: string;
  description: string;
}

const landmarkSchema: Landmark = new Schema({
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
});
const landmarkModel = model("landmark", landmarkSchema, "landmarks");

export = { landmarkModel };
