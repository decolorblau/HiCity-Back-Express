import { Joi } from "express-validation";

const folderSchemaValidator = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

export default folderSchemaValidator;
