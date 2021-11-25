import { Joi } from "express-validation";

const userSchemaValidator = {
  body: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default userSchemaValidator;
