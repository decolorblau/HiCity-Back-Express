import LandmarkModel from "../../database/models/landMarks";
import {
  createLandmark,
  getLandmarks,
  getLandmarkById,
  editLandmark,
} from "./landmarkController";

jest.mock("../../database/models/landMarks.ts");

interface IResponseTest {
  status: () => void;
  json: () => void;
}

class NewError extends Error {
  code: number | undefined;
}

const mockResponse = () => {
  const res: IResponseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

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
      const res = {
        json: jest.fn(),
      };

      await getLandmarks(null, res, null);

      expect(LandmarkModel.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenLastCalledWith(landmark);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      LandmarkModel.find = jest.fn().mockRejectedValue(null);
      const res = {
        json: jest.fn(),
      };
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
      const idLandmark = 2;
      const req = {
        params: {
          idLandmark,
        },
      };
      const res = {
        json: () => {},
      };
      const next = () => {};

      await getLandmarkById(req, res, next);

      expect(LandmarkModel.findById).toHaveBeenCalledWith(idLandmark);
    });
    describe("And Landmark.findById rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = new NewError();
        LandmarkModel.findById = jest.fn().mockRejectedValue(error);
        const idLandmark = 0;

        const req = {
          params: {
            idLandmark,
          },
        };

        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();

        await getLandmarkById(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(error.code).toBe(400);
      });
    });
    describe("And Landmark.findById resolves to Budellera", () => {
      test("Then it should invoke res. json with a Budellera", async () => {
        const idLandmark = 2;
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
        const req = {
          params: {
            idLandmark,
          },
        };
        const res = {
          json: jest.fn(),
        };

        await getLandmarkById(req, res, null);

        expect(res.json).toHaveBeenCalledWith(budellera);
      });
    });
    describe("And Pet.findById resolves to undefined", () => {
      test("Then it should invoke next function with the error", async () => {
        const idLandmark = 2;
        const error = new NewError("Landmark not found");
        error.code = 404;

        LandmarkModel.findById = jest.fn().mockResolvedValue(undefined);
        const req = {
          params: {
            idLandmark,
          },
        };
        const res = {
          json: jest.fn(),
        };
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
      const req = {
        body: {
          title: "Font",
          city: "Barcelona",
          category: "parque",
          latitude: 41.444914,
          longitude: 2.074983,
          introduction: "hello",
          description: "this is a description",
        },
      };

      const res = mockResponse();
      const expectedStatus = 201;

      LandmarkModel.findOne = jest.fn().mockResolvedValue(null);
      LandmarkModel.create = jest.fn().mockResolvedValue(req.body);

      await createLandmark(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
  describe("And Landmark create rejects", () => {
    test("Then it should invoke invoke next function with the error rejected", async () => {
      const error = new NewError();

      LandmarkModel.create = jest.fn().mockRejectedValue(error);

      const req = {
        body: {
          title: "",
          city: "",
          imageUrl: "",
          latitude: 1,
          longitude: 2,
          category: "",
          description: "",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await createLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
  describe("And Landmark create rejects", () => {
    test("Then it should invoke invoke next function with the error rejected", async () => {
      const landmark = {
        title: "Font",
        city: "Barcelona",
        category: "parque",
        latitude: 41.444914,
        longitude: 2.074983,
        introduction: "hello",
        description: "this is a description",
      };

      const req = {
        body: landmark,
      };
      const res = mockResponse();
      const error = new NewError("This landmark already exists");
      error.code = 400;

      LandmarkModel.findOne = jest.fn().mockResolvedValue(landmark);

      const next = jest.fn();

      await createLandmark(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(error.code).toBe(400);
    });
  });
});

describe("Given the editLandmark function", () => {
  describe("When it receives a valid id and valid object req", () => {
    test("Then it should invoke the  function with update landmark", async () => {
      const req = {
        file: { fileUrl: "fadfda" },
        landmarkData: {
          title: "",
          city: "",
          imageUrl: "",
          latitude: 1,
          longitude: 2,
          category: "",
          description: "",
        },
        params: {
          id: 1,
        },
        body: {
          title: "new-test",
          id: 1,
        },
      };

      const res = mockResponse();
      LandmarkModel.findById = jest.fn().mockResolvedValue(req.landmarkData);
      LandmarkModel.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);
      await editLandmark(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
    });
    describe("and edit landmark rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = new NewError();
        LandmarkModel.findById = jest.fn().mockRejectedValue(error);

        const req = {
          landmarkData: {
            title: "",
            city: "",
            imageUrl: "",
            latitude: 1,
            longitude: 2,
            category: "",
            description: "",
          },
          params: {
            id: 1,
          },
          body: {
            name: "new-test",
            id: 1,
          },
        };

        const res = mockResponse();
        const next = jest.fn();

        await editLandmark(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(next.mock.calls[0][0].code).toBe(400);
      });
    });
  });

  describe("When it receives a resolved function with a invalid id", () => {
    test("Then it should invoke the  function with a expectedError", async () => {
      const req = {
        landmarkData: {
          title: "",
          city: "",
          imageUrl: "",
          latitude: 1,
          longitude: 2,
          category: "",
          description: "",
        },
        params: {
          id: 1,
        },
        body: {
          titel: "new-test",
          id: 2,
        },
      };

      const next = jest.fn();
      const expectedError = new Error("Landmark not found.");
      LandmarkModel.findById = jest.fn().mockResolvedValue(null);
      await editLandmark(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
      expect(next.mock.calls[0][0].code).toBe(404);
    });
  });
});
