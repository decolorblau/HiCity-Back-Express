import LandmarkModel from "../../database/models/LandmarkModel";
import {
  createLandmark,
  getLandmarks,
  getLandmarkById,
  updateLandmark,
  getFolderLandmark,
  addFavoriteLandmark,
  deleteFavoriteLandmark
} from "./landmarkController";
import IErrorValidation from "../../interfaces/IError";
import mockResponse from "../mocks/mockResponse";
import mockRequestAuth from "../mocks/mockRequestAuth";
import FolderModel from "../../database/models/FolderModel";

jest.mock("../../database/models/LandmarkModel.ts");

jest.setTimeout(20000);

describe("Given the getLandmarks function", () => {
  describe("When it receives an object res and a resolved promise", () => {
    test("Then it should invoke the method json", async () => {
      const landmark = [
        {
          title: "Font de la Budellera",
          city: "Barcelona",
          imageUrl:
            "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2019/02/09111259/31938192_1935134759883440_7096267355839266816_n-1024x597.jpg",
          imagePath: "budellera.jpg",
          category: "parque",
          introduction:
            "El torrent de la Budellera és un petit curs d'aigua de Collserola, que neix a la font de la Budellera.",
          description:
            "A l’obaga del cim del Tibidabo, tocant a Vallvidrera, en un fondal d’una atracció singular s’hi amaga la font de la Budellera, la més popular d’entre les que es conserven al Parc de Collserola, ordenada a base de murs, terrasses i escales, data de la segona meitat del segle XIX. L’entorn de la Font es va restaurar el 1988 inspirant-se amb el projecte original de J.C. N. Forestier (1918). També s’hi col·locà, una font de xarxa i una obra d’en Tàpies que representa l’escut de Barcelona. Sobre l’origen del topònim hi ha versions diferents. Una el relaciona amb les propietats medicinals de l’aigua per prevenir i curar els mals d’estómac. L’altra fa referència a una casa que hi havia als seus peus, en la qual hi fabricaven cordes per guitarres l’any 1860.",
        },
      ];

      LandmarkModel.find = jest.fn().mockResolvedValue(landmark);
      const res = mockResponse();

      await getLandmarks(null, res, null);

      expect(res.json).toHaveBeenCalledWith(landmark);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      LandmarkModel.find = jest.fn().mockRejectedValue(null);
      const res = mockResponse();
      const next = jest.fn();

      await getLandmarks(null, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});

describe("Given a getLandmarkById function", () => {
  describe("When it receives a request with an id 2, a res object and a next function", () => {
    test("Then it should invoke LandmarkModel.findById with a 2", async () => {
      LandmarkModel.findById = jest.fn().mockRejectedValue({});
      const id = 2;
      const req = mockRequestAuth(null, null, { idLandmark: id }, null);

      const res = mockResponse();
      const next = jest.fn();

      await getLandmarkById(req, res, next);

      expect(LandmarkModel.findById).toHaveBeenCalledWith(id);
    });
    describe("And Landmark.findById rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = new Error() as IErrorValidation;

        LandmarkModel.findById = jest.fn().mockRejectedValue(error);
        const id = 2;
        const req = mockRequestAuth(null, null, { idLandmark: id }, null);

        const res = mockResponse();

        const next = jest.fn();

        await getLandmarkById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(error.code).toBe(400);
      });
    });
    describe("And Landmark.findById resolves to Budellera", () => {
      test("Then it should invoke res. json with a Budellera", async () => {
        const budellera = {
          title: "Font de la Budellera",
          city: "Barcelona",
          imageUrl:
            "https://offloadmedia.feverup.com/barcelonasecreta.com/wp-content/uploads/2019/02/09111259/31938192_1935134759883440_7096267355839266816_n-1024x597.jpg",
          imagePath: "budellera.jpg",
          category: "parque",
          introduction:
            "El torrent de la Budellera és un petit curs d'aigua de Collserola, que neix a la font de la Budellera.",
          description:
            "A l’obaga del cim del Tibidabo, tocant a Vallvidrera, en un fondal d’una atracció singular s’hi amaga la font de la Budellera, la més popular d’entre les que es conserven al Parc de Collserola, ordenada a base de murs, terrasses i escales, data de la segona meitat del segle XIX. L’entorn de la Font es va restaurar el 1988 inspirant-se amb el projecte original de J.C. N. Forestier (1918). També s’hi col·locà, una font de xarxa i una obra d’en Tàpies que representa l’escut de Barcelona. Sobre l’origen del topònim hi ha versions diferents. Una el relaciona amb les propietats medicinals de l’aigua per prevenir i curar els mals d’estómac. L’altra fa referència a una casa que hi havia als seus peus, en la qual hi fabricaven cordes per guitarres l’any 1860.",
        };
        LandmarkModel.findById = jest.fn().mockResolvedValue(budellera);
        const id = 2;
        const req = mockRequestAuth(null, null, { idLandmark: id }, null);

        const res = mockResponse();

        await getLandmarkById(req, res, null);

        expect(res.json).toHaveBeenCalledWith(budellera);
      });
    });
    describe("And Landmark.findById resolves to undefined", () => {
      test("Then it should invoke next function with the error", async () => {
        const error = new Error("Landmark not found") as IErrorValidation;
        error.code = 404;

        LandmarkModel.findById = jest.fn().mockResolvedValue(undefined);
        const id = 2;
        const req = mockRequestAuth(null, null, { idLandmark: id }, null);
        const res = mockResponse();

        const next = jest.fn();

        await getLandmarkById(req, res, next);

        expect(error.code).toBe(404);
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});

describe("Given a createLandmark function", () => {
  describe("When it receives a request with a new landmark, a res object and a next function", () => {
    test("Then it should invoke landmark create with a new landmark point", async () => {
      const landmark = {
        title: "Font",
        city: "Barcelona",
        category: "parque",
        latitude: 41.444914,
        longitude: 2.074983,
        introduction: "hello",
        description: "this is a description",
      };

      const req = mockRequestAuth(landmark, null, null, null);
      req.file="https://media.istockphoto.com/photos/hot-air-balloons-flying-over-the-botan-canyon-in-turkey-picture-id1297349747?b=1&k=20&m=1297349747&s=170667a&w=0&h=oH31fJty_4xWl_JQ4OIQWZKP8C6ji9Mz7L4XmEnbqRU="

      const res = mockResponse();
      const expectedStatus = 201;

      LandmarkModel.findOne = jest.fn().mockResolvedValue(null);
      LandmarkModel.create = jest.fn().mockResolvedValue(req.body);

      await createLandmark(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
  describe("And LandmarkModel.create rejects", () => {
    test("Then it should invoke next function with the error rejected", async () => {
      const error = new Error() as IErrorValidation;
      const landmark = {
        title: "Font",
        city: "Barcelona",
        category: "parque",
        latitude: 41.444914,
        longitude: 2.074983,
        introduction: "hello",
        description: "this is a description",
      };

      LandmarkModel.create = jest.fn().mockRejectedValue(error);
      const req = mockRequestAuth(landmark, null, null, null);
      const res = mockResponse();
      const next = jest.fn();

      await createLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
  describe("And Landmark create rejects", () => {
    test("Then it should invoke next function with the error rejected", async () => {
      const landmark = {
        title: "Font",
        city: "Barcelona",
        category: "parque",
        latitude: 41.444914,
        longitude: 2.074983,
        introduction: "hello",
        description: "this is a description",
      };

      const req = mockRequestAuth(landmark, null, null, null);
      const res = mockResponse();
      const error = new Error(
        "This landmark already exists"
      ) as IErrorValidation;

      error.code = 400;

      LandmarkModel.findOne = jest.fn().mockResolvedValue(landmark);

      const next = jest.fn();

      await createLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
});

describe("Given the updateLandmark function", () => {
  describe("When it receives a valid id and valid object req", () => {
    test("Then it should invoke the  function with update landmark", async () => {
      const landmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
      };

      const req = mockRequestAuth(landmark, null, { id: 1 }, null);
      req.file = "imageUrl";

      const res = mockResponse();
      const next = jest.fn();

      LandmarkModel.findById = jest.fn().mockResolvedValue(landmark);
      LandmarkModel.findByIdAndUpdate = jest.fn().mockResolvedValue(landmark);

      await updateLandmark(req, res, next);

      expect(res.json).toHaveBeenCalledWith(landmark);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    describe("and edit landmark rejects", () => {
      test("Then it should invoke next function with the error rejected", async () => {
        const landmark = {
          title: "new-test",
          city: "test",
          latitude: 1,
          longitude: 2,
          category: "test",
          introduction: "test",
          description: "test",
        };

        const req = mockRequestAuth(landmark, null, { id: 1 }, null);
        req.file = "imageUrl";

        const res = mockResponse();
        const next = jest.fn();
        const error = new Error() as IErrorValidation;

        LandmarkModel.findById = jest.fn().mockRejectedValue(error);

        await updateLandmark(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next.mock.calls[0][0].code).toBe(400);
      });
    });
  });

  describe("When it receives a resolved function with a invalid id", () => {
    test("Then it should invoke the  function with a expectedError", async () => {
      const landmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
      };

      const req = mockRequestAuth(landmark, null, { id: 1 }, null);
      req.file = "imageUrl";

      const next = jest.fn();
      const error = new Error("Landmark not found.") as IErrorValidation;

      LandmarkModel.findById = jest.fn().mockResolvedValue(null);
      await updateLandmark(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });
});

describe("Given the getFolderLandmark function", () => {
  describe("When it receives a valid idFolder", () => {
    test("Then it should invoke the  function with folder landmarks", async () => {
      const folderLandmarks = {
        landmarks: ["3532525", "3532528"],
      };

      const req = mockRequestAuth(null, null, null, null);

      req.idFolder = "35325";

      const res = mockResponse();
      const next = jest.fn();

      FolderModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(folderLandmarks),
      });

      await getFolderLandmark(req, res, next);

      expect(res.json).toHaveBeenLastCalledWith(folderLandmarks.landmarks);
    });
  });
  describe("When FolderModel.findById rejects", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const req = mockRequestAuth(null, null, null, null);

      req.idFolder = "35325";

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error("Could not get landmarks") as IErrorValidation;
      error.code = 400;

      FolderModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await getFolderLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
});

describe("Given the addFavoriteLandmark function", () => {
  describe("When it receives a valid idLandmark, valid idUser and this landmark is not included in userFolder", () => {
    test("Then it should invoke the function with userFolder with new idLandmark", async () => {
      const userFolder = {
        landmarks: [],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const landmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
        id: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();

      LandmarkModel.findOne = jest.fn().mockReturnValue(landmark);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(false);

      await addFavoriteLandmark(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        ...userFolder,
        landmarks: [req.params.idLandmark],
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  describe("When it receives a valid idLandmark, valid idUser and this landmark is included in userFolder", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const userFolder = {
        landmarks: [],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const landmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
        id: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error(
        "The landmark already includes this landmark"
      ) as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(landmark);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(true);

      await addFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(409);
    });
  });
  describe("When FolderModel or LandmarkModel are not found", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const userFolder = {
        landmarks: [],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error("Folder not Found") as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(null);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(true);

      await addFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });
  describe("When FolderModel or LandmarkModel rejects", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const userFolder = {
        landmarks: [],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error(
        "Error adding favorite Landmark"
      ) as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(error);
      FolderModel.findOne = jest.fn().mockReturnValue(error);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(true);

      await addFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(400);
    });
  });
});

describe("Given the deleteFavoriteLandmark function", () => {
  describe("When it receives a valid idLandmark, valid idUser and this landmark is included in userFolder", () => {
    test("Then it should invoke the function with userFolder with new idLandmark", async () => {
      const userFolder = {
        landmarks: ["3224"],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const deleteLandmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
        _id: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();

      LandmarkModel.findOne = jest.fn().mockReturnValue(deleteLandmark);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(true);
      FolderModel.findByIdAndUpdate= jest.fn().mockReturnValue(userFolder)

      await deleteFavoriteLandmark(req, res, next);

      expect(res.json).toHaveBeenCalledWith(deleteLandmark);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
  describe("When it receives a valid idLandmark, valid idUser and this landmark is not included in userFolder", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const userFolder = {
        landmarks: ["3224"],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const deleteLandmark = {
        title: "new-test",
        city: "test",
        latitude: 1,
        longitude: 2,
        category: "test",
        introduction: "test",
        description: "test",
        _id: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error(
        "Error: could't find the landmark in your folders"
      ) as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(deleteLandmark);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);
      userFolder.landmarks.includes = jest.fn().mockReturnValue(false);

      await deleteFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });
  describe("When Landmark is not found", () => {
    test("Then should invoke next function with the error rejected", async () => {
      const userFolder = {
        landmarks: ["3224"],
        userId: "35325",
        save: jest.fn(),
      };

      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);
      req.userData = {
        id: "35325",
      };
      req.params = {
        idLandmark: "3224",
      };

      const res = mockResponse();
      const next = jest.fn();
      const error = new Error("Landmark not found") as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(null);
      FolderModel.findOne = jest.fn().mockReturnValue(userFolder);

      await deleteFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });
  describe("When FolderModel or LandmarkModel rejects", () => {
    test("Then should invoke next function with the error rejected", async () => {


      const req = mockRequestAuth(null, { idLandmark: "3224" }, null, null);


      const res = mockResponse();
      const next = jest.fn();
      const error = new Error(
        "Error: couldn't delete favorite landmark"
      ) as IErrorValidation;

      LandmarkModel.findOne = jest.fn().mockReturnValue(error);
      FolderModel.findOne = jest.fn().mockReturnValue(error);

      await deleteFavoriteLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0].code).toBe(400);
    });
  });
});
