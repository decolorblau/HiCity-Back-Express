import RequestAuth from "../../interfaces/RequestAuth";

const mockRequestAuth = (
  body?: any,
  header?: any,
  params?: any,
  query?: any
) => {
  const req = {} as RequestAuth;
  req.body = body;
  req.header = jest.fn().mockReturnValue(header);
  req.userId = "";
  req.params = params;
  req.images = "";
  req.query = query;

  return req;
};

export default mockRequestAuth;
