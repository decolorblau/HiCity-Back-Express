import jwt from "jsonwebtoken";
import chalk from "chalk";
import debug from "debug";

class NewError extends Error {
  code: number | undefined;
}

const checkAuthorization = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new NewError("Unauthorized.");
    debug(chalk.red(error.message));
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new NewError("Unauthorized.");
      debug(chalk.red(error.message));
      error.code = 401;
      next(error);
    } else {
      try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { id };

        next();
      } catch {
        const error = new NewError("Unauthorized.");
        debug(chalk.red(error.message));
        error.code = 401;
        next(error);
      }
    }
  }
};

export default checkAuthorization;
