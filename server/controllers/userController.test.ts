import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../../database/models/user";
import { userSingUp, loginUser } from "./userController";

dotenv.config();

jest.mock("../../database/models/user");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

interface IResponseTest {
  status: () => void;
  json: () => void;
}

class NewError extends Error {
  code: number | undefined;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given the userSingUp function", () => {
  describe("When it receives the req res objects and the promise resolves", () => {
    test("Then it should invoke the method json and status", async () => {
      const req = {
        body: {
          username: "test",
          password: "test",
          admin: false,
        },
      };
      const res = mockResponse();

      const expectedStatus = 201;
      UserModel.create = jest.fn().mockResolvedValue(req.body);
      await userSingUp(req, res, () => {});

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives the req object , the next function, and the promise rejects", () => {
    test("Then it should invoke the method json", async () => {
      const req = {
        body: {
          username: "test",
          password: "test",
          admin: false,
        },
      };

      const next = jest.fn();
      const error = new NewError("Error creating the user");

      UserModel.create = jest.fn().mockRejectedValue(null);
      await userSingUp(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
  describe("When it receives a request with an existing email", () => {
    test("Then it should invoke the next function with an error", async () => {
      const emailTest = "test@test.com";

      const req = {
        body: {
          email: emailTest,
        },
      };

      UserModel.findOne = jest.fn().mockResolvedValue(true);
      const error = new NewError("This email is already registered");
      error.code = 400;
      const next = jest.fn();

      UserModel.create = jest.fn().mockRejectedValue(null);
      await userSingUp(req, null, next);

      expect(UserModel.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});

describe("Given the loginUser function", () => {
  describe("When it receives the req object and the promise rejects", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };

      const next = jest.fn();
      const error = new Error("Error logging in the user");

      UserModel.findOne = jest.fn().mockRejectedValue(null);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives the req object, the next function and promise resolves null", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };

      const next = jest.fn();
      const error = new Error("Wrong credentials");

      UserModel.findOne = jest.fn().mockResolvedValue(null);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives the req object, the next function and promise resolves, but the password is wrong", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };

      const next = jest.fn();
      const error = new Error("Wrong credentials");

      bcrypt.compare = jest.fn().mockResolvedValue(false);
      UserModel.findOne = jest.fn().mockResolvedValue(null);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives the req object, the next function and promise resolves with all the credentials good", () => {
    test("Then it should invoke the json method with", async () => {
      const req = {
        body: {
          id: 1,
          email: "test@test.com",
          password: "test",
        },
      };

      const res = mockResponse();

      const expectedToken = 123;

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      UserModel.findOne = jest.fn().mockResolvedValue(req.body);
      await loginUser(req, res, () => {});

      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });
});
