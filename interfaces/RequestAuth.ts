import { Request } from "express";

interface RequestAuth extends Request {
  params: any;
  userId?: string;
  email?: string;
  file?: any;
  idFolder?: string;
  userData?: any;
}

export default RequestAuth;
