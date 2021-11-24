import landmarkModel from "../../database/models/landMarks";

export const getLandmarks = async (req, res, next) => {
  try {
    const landmarks = await landmarkModel.find();
    res.json(landmarks);
  } catch (error) {
    next(error);
  }
};

export const createLandmark = async (req, res, next) => {
  try {
    const landmark = req.body;
    const newLandmark = await landmarkModel.create(landmark);
    res.status(201).json(newLandmark);
  } catch (error) {
    error.code = 400;
    error.message = "Ouch! This is not a landmark!";
    next(error);
  }
};
