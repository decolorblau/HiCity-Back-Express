import Debug from "debug";
import chalk from "chalk";
import mongoose from "mongoose";

const debug = Debug("HiCity:database");

const connectDB = (connectionDB) =>
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

export default connectDB;
