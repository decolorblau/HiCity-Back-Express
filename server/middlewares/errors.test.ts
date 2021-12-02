import { notFoundErrorHandler, generalErrorHandler } from "./errors";
import IErrorValidation from "../../interfaces/IError";
import mockResponse from "../mocks/mockResponse";

describe("Given a notFoundErrorHandler", () => {
  describe("When it receives a null request", () => {
    test("Then it should return error statusCode 404 and 'Endpoint not found'", () => {
      const res = mockResponse();
      const expectedError = { error: "Endpoint not found" };

      notFoundErrorHandler(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a generalErrorHandler", () => {
  describe("When it receives an error without instanceof ValidationError, with error statusCode 401 and 'test error'", () => {
    test("Then it should return error statusCode 401 and 'test error' message", () => {
      const res = mockResponse();
      const error = new Error("test error") as IErrorValidation;
      error.code = 401;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.code);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  describe("When it receives an error without instanceof ValidationError, without error statusCode and message", () => {
    test("Then it should return error statusCode 500 and 'General error' message", () => {
      const res = mockResponse();
      const error = new Error() as IErrorValidation;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "General error" });
    });
  });
  describe("When it receives an error with instanceof ValidationError, with error statusCode 400 and 'Bad request'", () => {
    test("Then it should return error statusCode 400 and 'Bad request", () => {
      const res = mockResponse();
      const error = new Error("Bad request") as IErrorValidation;
      error.statusCode = 400;

      generalErrorHandler(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
