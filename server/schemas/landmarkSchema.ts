import { Joi } from "express-validation";

export const landmarkCreateSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    city: Joi.string().required(),
    imageUrl: Joi.string().required(),
    category: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    introduction: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export const landmarkEditSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    city: Joi.string().required(),
    imageUrl: Joi.string().required(),
    category: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    introduction: Joi.string().required(),
    description: Joi.string().required(),
  }),
};
