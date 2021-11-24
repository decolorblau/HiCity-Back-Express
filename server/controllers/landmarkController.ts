import landmarkModel from "../../database/models/landMarks";

const getLandmarks = async (req, res, next) => {
  try {
    const landmarks = await landmarkModel.find();
    res.json(landmarks);
  } catch (error) {
    next(error);
  }
};

export default getLandmarks;
