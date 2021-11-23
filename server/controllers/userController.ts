import bcrypt from "bcrypt";
import UserModel from "../../database/models/user";
import chalk from "chalk";
import debug from "debug";

class NewError extends Error {
  code: number | undefined;
}

export const userSingUp = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const error = new NewError("This email is already registered");
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
