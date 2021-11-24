import chalk from "chalk";
import { ValidationError } from "express-validation";
import debug from "debug";

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error, req, res, next) => {
  debug(chalk.red("Some error happens: ", error.message));
  if (error instanceof ValidationError) {
    error.message = "Bad request";
    error.statusCode = 400;
  }
  const message = error.code ? error.message : "General error";
  res.status(error.code || 500).json({ error: message });
};
