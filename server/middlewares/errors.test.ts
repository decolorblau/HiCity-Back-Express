const { ValidationError } = require("express-validation");
import { notFoundErrorHandler, generalErrorHandler } from "./errors";

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given a notFoundErrorHandler", () => {
  describe("When it receives a null request", () => {
    test("Then it should return error code 404 and 'Endpoint not found'", () => {
      const res = mockResponse();
      const expectedError = { error: "Endpoint not found" };

      notFoundErrorHandler(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith();
    });
  });
});

describe("Given a generalErrorHandler", () => {
  describe("When it receives an error without instanceof ValidationError, with error code 401 and 'test error'", () => {
    test("Then it should return error code 400 and 'test error' message", () => {
      const res = mockResponse();
      const error = {
        code: 401,
        message: "test error",
      };

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.code);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  describe("When it receives an error without instanceof ValidationError, without error code and message", () => {
    test("Then it should return error code 500 and 'General error' message", () => {
      const res = mockResponse();
      const error = {};

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "General error" });
    });
  });
  describe("When it receives an error with instanceof ValidationError, with error code 400 and 'Bad request'", () => {
    test("Then it should return error code 400 and 'Bad request", () => {
      const error = new ValidationError("string validation", {
        statusCode: 500,
        error: new Error(),
      });

      const expectedError = { error: "Bad request" };
      const expectedStatus = 400;

      const res = mockResponse();

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
