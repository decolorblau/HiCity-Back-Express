import express from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Debug from "debug";

import userRoutes from "./routes/userRoutes";

import {
  notFoundErrorHandler,
  generalErrorHandler,
} from "./middlewares/errors";

dotenv.config();
const debug = Debug("HiCity:server");

interface Error {
  code: number | string;
  message: string;
}

const app = express();
app.use(cors());

const initializeServer = (port) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Listening ${port} port`));
      resolve(server);
    });
    server.on("error", (error: Error) => {
      debug(chalk.red("There was an error starting the server."));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`The port ${port} is in use.`));
      }
    });
    server.on("close", () => {
      debug(chalk.yellow("server express disconnected"));
    });
  });

app.use(morgan("dev"));
app.use(express.json());
app.use("/users", userRoutes);
app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

export { initializeServer, app };
