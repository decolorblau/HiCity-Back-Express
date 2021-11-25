import { Joi } from "express-validation";

const userSchemaValidator = {
  body: Joi.object({
    title: Joi.string().required(),
    city: Joi.string().required(),
    imageUrl: Joi.string().required(),
    category: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
    }),
    lastUpdate: Joi.date().required(),
    introduction: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

export default userSchemaValidator;
