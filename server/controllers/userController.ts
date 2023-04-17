import bcrypt from "bcrypt";
import chalk from "chalk";
import Debug from "debug";

import jwt from "jsonwebtoken";
import UserModel from "../../database/models/UserModel";
import IErrorValidation from "../../interfaces/IError";

const debug = Debug("HiCity:user");

export const userSingUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const error = new Error(
        "This email is already registered"
      ) as IErrorValidation;
      debug(chalk.red(error.message));
      error.code = 400;
      next(error);
    } else {
      const newUser = await UserModel.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });

      res.status(201).json(newUser);
      debug(chalk.green("User registered correctly"));
    }
  } catch {
    const error = new Error("Error creating the user") as IErrorValidation;
    debug(chalk.red(error.message));
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      const error = new Error("Wrong credentials") as IErrorValidation;
      debug(chalk.red(error.message));
      error.code = 401;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);
      if (!rightPassword) {
        const error = new Error("Wrong credentials") as IErrorValidation;
        debug(chalk.red(error.message));
        error.code = 401;
        next(error);
      } else {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            folders: user.folders,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 48 * 60 * 60,
          }
        );
        res.json({ token });
      }
    }
  } catch {
    const error = new Error("Error logging in the user") as IErrorValidation;
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
