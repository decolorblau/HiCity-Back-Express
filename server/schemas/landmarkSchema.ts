import { Joi } from "express-validation";

export const landmarkCreateSchema = {
  body: Joi.object({
    title: Joi.string().required(),
    city: Joi.string().required(),
    imageUrl: Joi.string(),
    category: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    introduction: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export const landmarkEditSchema = {
  body: Joi.object({
    title: Joi.string(),
    city: Joi.string(),
    imageUrl: Joi.string(),
    category: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    introduction: Joi.string(),
    description: Joi.string(),
  }),
};
