import chalk from "chalk";
import { ValidationError } from "express-validation";
import debug from "debug";

interface Error {
  code: number | string;
  message: string;
}

export const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generalErrorHandler = (error: Error, req, res, next) => {
  debug(chalk.red("Some error happens: ", error.message));
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Bad request";
  }
  const message = error.code ? error.message : "General error";
  res.status(error.code || 500).json({ error: message });
};
