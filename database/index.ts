import { debug } from "console";
import Debug from "debug";
const chalk = require("chalk");
const mongoose = require("mongoose");

debug();

export const connectDB = (connectionDB) =>
  new Promise<void>((resolve, reject) => {
    mongoose.set("debug", false);

    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(connectionDB, (error) => {
      if (error) {
        debug(chalk.red("The database could not be started", error.message));
        debug(chalk.red(error.message));

        reject();
        return;
      }
      debug(chalk.green("The database is connected"));
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("DB disconnected"));
    });
  });
