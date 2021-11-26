import { Joi } from "express-validation";

export const loginSchemaValidator = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    folders: [Joi.string],
  }),
};

export const registerSchemaValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    folders: [Joi.string],
  }),
};
