import FolderModel from "../../database/models/folder";
import { getFolders } from "./folderController";

jest.mock("../../database/models/landMarks.ts");

describe("Given the getFolders function", () => {
  describe("When it receives an object res and a resolved promise", () => {
    test("Then it should invoke the method json", async () => {
      const folders = [{}];

      FolderModel.find = jest.fn().mockResolvedValue(folders);
      const res = {
        json: jest.fn(),
      };

      await getFolders(null, res, null);

      expect(FolderModel.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenLastCalledWith(folders);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      FolderModel.find = jest.fn().mockRejectedValue(null);
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await getFolders(null, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
