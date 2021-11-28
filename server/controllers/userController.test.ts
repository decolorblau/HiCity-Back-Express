import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../../database/models/UserModel";
import { userSingUp, loginUser, getUsers } from "./userController";
import mockResponse from "../mocks/mockResponse";


dotenv.config();

jest.mock("../../database/models/UserModel");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

class NewError extends Error {
  code: number | undefined;
}

describe("Given the userSingUp function", () => {
  describe("When it receives the req res objects and the promise resolves", () => {
    test("Then it should invoke the method json and status", async () => {
      const req = {
        body: {
          name:"test",
          email: "test",
          password: "test",
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      const expectedStatus = 201;
      UserModel.create = jest.fn().mockResolvedValue(req.body);
      await userSingUp(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe("When it receives the req object , the next function, and the promise rejects", () => {
    test("Then it should invoke the method json", async () => {
      const req = {
        body: {
          name:"test",
          email: "test",
          password: "test",
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

  describe("When it receives the req object with correct email  and wrong password", () => {
    test("Then it should invoke the next function with a error", async () => {
      const req = {
        body: {
          email: "test@test.com",
          password: "test",
        },
      };

      const next = jest.fn();
      const error = new NewError("Wrong credentials");
      error.code = 401;

      UserModel.findOne = jest.fn().mockResolvedValue({
        email: "hola@hola.com",
        password: "hola",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);
      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
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
      const next = jest.fn();
      const expectedToken = 123;

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);
      UserModel.findOne = jest.fn().mockResolvedValue(req.body);
      await loginUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });
});

describe("Given the getUsers function", () => {
  describe("When it receives an object res and a resolved promise", () => {
    test("Then it should invoke the method json", async () => {
      const users = [
        { 
          name:"test1",
          email: "test1",
          password: "test1",
        },
        { 
          name:"test2",
          email: "test2",
          password: "test2",
        },
      ];

      UserModel.find = jest.fn().mockResolvedValue(users);
      const res = mockResponse();

      await getUsers(null, res, null);

      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      UserModel.find = jest.fn().mockRejectedValue(null);
      const res = mockResponse();
      const next = jest.fn();

      await getUsers(null, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
