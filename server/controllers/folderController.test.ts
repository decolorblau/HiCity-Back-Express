import FolderModel from "../../database/models/FolderModel";
import UserModel from "../../database/models/UserModel";
import {
  createFolder,
  getFolders,
  getUserFolder,
  getUserFolderById,
} from "./folderController";

jest.mock("../../database/models/FolderModel.ts");
jest.mock("../../database/models/UserModel.ts");

class NewError extends Error {
  code: number | undefined;
}

interface IResponseTest {
  status: () => void;

  json: () => void;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("Given the getFolders function", () => {
  describe("When it receives an object res and a resolved promise", () => {
    test("Then it should invoke the method json", async () => {
      const folders = [{}];

      FolderModel.find = jest.fn().mockResolvedValue(folders);
      const res = mockResponse();

      await getFolders(null, res, null);

      expect(res.json).toHaveBeenLastCalledWith(folders);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      FolderModel.find = jest.fn().mockRejectedValue(null);
      const res = mockResponse();
      const next = jest.fn();

      await getFolders(null, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Given the getUsersFolders function", () => {
  describe("When it receives an object res and a resolved promise", () => {
    test("Then it should invoke the method json", async () => {
      const userFolders = {
        folders: ["3532525", "3532525"],
      };
      const req = {
        userData: {
          id: "3532525",
        },
      };
      const res = mockResponse();

      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(userFolders),
      });

      await getUserFolder(req, res, null);

      expect(res.json).toHaveBeenLastCalledWith(userFolders.folders);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      const req = {
        userData: {
          id: "3532525",
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      UserModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await getUserFolder(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Given a getUserFolderById function", () => {
  describe("And Folder.findById rejects", () => {
    test("Then it should invoke invoke next function with the error rejected", async () => {
      const error = new NewError();
      const idFolder = 0;
      const req = {
        params: {
          userId: 4,
          idFolder,
        },
      };

      FolderModel.findById = jest.fn().mockRejectedValue(error);

      const res = mockResponse();
      const next = jest.fn();

      await getUserFolderById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
  describe("And Folder.findById resolves to folderUserId and userId and userData id is equal", () => {
    test("Then it should invoke res. json with a folderUserId", async () => {
      const idFolder = 2;
      const req = {
        params: {
          idFolder,
        },
        userData: {
          id: "4",
        },
      };

      const folderUserId = {
        userId: "4",
        name: "restaurant",
        landmarks: ["dfafd", "3rrrf344"],
        creationData: "4567890'098765",
      };

      const res = mockResponse();

      FolderModel.findById = jest.fn().mockResolvedValue(folderUserId);

      await getUserFolderById(req, res, null);

      expect(res.json).toHaveBeenCalledWith(folderUserId);
    });
  });
  describe("And Folder.findById resolves to folderUserId but userId and userData id is diferent", () => {
    test("Then it should invoke next function with the error 404", async () => {
      const idFolder = 2;
      const req = {
        params: {
          idFolder,
        },
        userData: {
          id: "4",
        },
      };

      const folderUserId = {
        userId: "5",
        name: "restaurant",
        landmarks: ["dfafd", "3rrrf344"],
        creationData: "4567890'098765",
      };

      const error = new NewError("Folder not found");
      error.code = 404;
      const res = mockResponse();
      const next = jest.fn();

      FolderModel.findById = jest.fn().mockResolvedValue(folderUserId);

      await getUserFolderById(req, res, next);

      expect(error.code).toBe(404);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a createFolder function", () => {
  describe("When it receives a request with a new folder and a res object", () => {
    test("Then it should invoke FolderModel.create with a new folder and push the id folder to userModel", async () => {
      const id = "3";

      const req = {
        body: {
          name: "new folder",
          userId: id,
        },
        userData: {
          id,
        },
      };
      const res = mockResponse();
      const expectedStatus = 201;
      const next = jest.fn();
      const user = {
        save: jest.fn(),
        folders: {
          push: jest.fn(),
        },
      };

      UserModel.findById = jest.fn().mockResolvedValue(user);
      FolderModel.findOne = jest.fn().mockResolvedValue(null);
      FolderModel.create = jest.fn().mockResolvedValue(req.body);

      await createFolder(req, res, next);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenLastCalledWith(expectedStatus);
    });
    describe("And FolderMoldel.create rejects", () => {
      test("Then it should invoke next function with the error rejected", async () => {
        const id = "3";

        const req = {
          body: {
            name: "new folder",
            userId: id,
          },
          userData: {
            id,
          },
        };
        const res = mockResponse();
        const error = new NewError("Error creating the folder");
        error.code = 400;
        const next = jest.fn();

        FolderModel.create = jest.fn().mockRejectedValue(error);

        await createFolder(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(error.code).toBe(400);
      });
    });
    describe("When it receives a request with a new folder but it exist already and a res object", () => {
      test("Then it should invoke next function with the error 401", async () => {
        const id = "3";
        const folder = {
          name: "new folder",
          userId: id,
        };

        const req = {
          body: {
            name: "new folder",
            userId: id,
          },
          userData: {
            id,
          },
        };
        const user = {
          id,
        };
        const res = mockResponse();
        const error = new NewError("This folder already exist");
        error.code = 406;
        const next = jest.fn();

        UserModel.findById = jest.fn().mockResolvedValue(user);
        FolderModel.findOne = jest.fn().mockResolvedValue(folder);
        FolderModel.create = jest.fn().mockResolvedValue(error);

        await createFolder(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next.mock.calls[0][0].code).toBe(406);
      });
    });
  });
});
