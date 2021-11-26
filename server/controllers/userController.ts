import bcrypt from "bcrypt";
import chalk from "chalk";
import Debug from "debug";

import jwt from "jsonwebtoken";
import UserModel from "../../database/models/user";

const debug = Debug("HiCity:user");
class NewError extends Error {
  code: number | undefined;
}

export const userSingUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const error: any = new NewError("This email is already registered");
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
    const error = new Error("Error creating the user");
    debug(chalk.red(error.message));
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      const error = new NewError("Wrong credentials");
      debug(chalk.red(error.message));
      error.code = 500;
      next(error);
    } else {
      const rightPassword = await bcrypt.compare(password, user.password);
      if (!rightPassword) {
        const error = new NewError("Wrong credentials");
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
    const error = new Error("Error logging in the user");
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
