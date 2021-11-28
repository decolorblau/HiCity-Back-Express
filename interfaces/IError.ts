import { ValidationError } from "express-validation";

export default interface IError extends ValidationError {
  code: number | string;
}
