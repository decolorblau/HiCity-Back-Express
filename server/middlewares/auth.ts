import jwt from "jsonwebtoken";
import Error from "../../interfaces/errorInterface/errorInterface";

class NewError extends Error {
  code: number | undefined;
}

const checkAuthorization = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    const error = new NewError("Unauthorized.");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new NewError("Unauthorized.");
      error.code = 401;
      next(error);
    } else {
      try {
        const { id, username, admin } = jwt.verify(
          token,
          process.env.JWT_SECRET
        );
        req.userData = { id, username, admin };

        next();
      } catch {
        const error = new NewError("Unauthorized.");
        error.code = 401;
        next(error);
      }
    }
  }
};

export default checkAuthorization;
