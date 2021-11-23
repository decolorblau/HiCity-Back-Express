import chalk from "chalk";
import { ValidationError } from "express-validation";
import debug from "debug";
import Error from "../../interfaces/errorInterface/errorInterface";

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error: Error, req, res, next) => {
  debug(chalk.red("Some error happens: ", error.message));
  if (error instanceof ValidationError) {
    error.message = "Bad request";
    error.statusCode = 400;
  }
  const message = error.statusCode ? error.message : "General error";
  res.status(error.statusCode || 500).json({ error: message });
};
