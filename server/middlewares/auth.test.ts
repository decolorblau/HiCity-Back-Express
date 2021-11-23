import jwt from "jsonwebtoken";
import checkAuthorization from "./auth";

jest.mock("jsonwebtoken");

class NewError extends Error {
  code: number | undefined;
}

describe("Given a checkAuthorization function", () => {
  describe("When it receives an Unauthorization request", () => {
    test("Then it should return error code 401 and Unauthorized message", () => {
      const req = {
        header: jest.fn(),
      };
      const error = new NewError("Unauthorized.");
      error.code = 401;
      const next = jest.fn();

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a Authorization request without token ", () => {
    test("Then it should return error code 401 and Unauthorized message", () => {
      const req = {
        header: jest.fn().mockReturnValue("1"),
      };

      const error = new NewError("Unauthorized.");
      error.code = 401;
      const next = jest.fn();

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
  describe("When it receives a Authorization request with good token ", () => {
    test("Then it should invoke the next function", () => {
      const req = {
        header: jest
          .fn()
          .mockReturnValue(
            "Bearer DGhKdN5jBP2ndIeLQpXumjYHCAkx0UeIGVAJMLhAJLc"
          ),
      };

      jwt.verify = jest.fn().mockReturnValue("something here");

      const next = jest.fn();

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When it receives a Authorization request with wrong token ", () => {
    test("Then it should invoke next function with error and return error code 401 and Unauthorized message", () => {
      const req = {
        header: jest
          .fn()
          .mockReturnValue(
            "Bearer ayJhbGciOiJIUzI1NiIsInR5cCBP2ndIeLQpXumjYHCAkx0UeIGVAJMLhAJLc"
          ),
      };

      jwt.verify = jest.fn().mockReturnValue(null);

      const next = jest.fn();
      const error = new NewError("Unauthorized.");
      error.code = 401;

      checkAuthorization(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("message", error.message);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});
