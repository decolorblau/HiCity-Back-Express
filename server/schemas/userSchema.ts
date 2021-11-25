import { Joi } from "express-validation";

const userSchemaValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default userSchemaValidator;
