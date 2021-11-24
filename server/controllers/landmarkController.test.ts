import landmarkModel from "../../database/models/landMarks";
import { createLandmark, getLandmarks } from "./landmarkController";

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
          category: "parque",
          introduction:
            "El torrent de la Budellera és un petit curs d'aigua de Collserola, que neix a la font de la Budellera.",
          description:
            "A l’obaga del cim del Tibidabo, tocant a Vallvidrera, en un fondal d’una atracció singular s’hi amaga la font de la Budellera, la més popular d’entre les que es conserven al Parc de Collserola, ordenada a base de murs, terrasses i escales, data de la segona meitat del segle XIX. L’entorn de la Font es va restaurar el 1988 inspirant-se amb el projecte original de J.C. N. Forestier (1918). També s’hi col·locà, una font de xarxa i una obra d’en Tàpies que representa l’escut de Barcelona. Sobre l’origen del topònim hi ha versions diferents. Una el relaciona amb les propietats medicinals de l’aigua per prevenir i curar els mals d’estómac. L’altra fa referència a una casa que hi havia als seus peus, en la qual hi fabricaven cordes per guitarres l’any 1860.",
        },
      ];

      landmarkModel.find = jest.fn().mockResolvedValue(landmark);
      const res = {
        json: jest.fn(),
      };

      await getLandmarks(null, res, null);

      expect(landmarkModel.find).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenLastCalledWith(landmark);
    });
  });

  describe("When it receives an object res and a rejected promise", () => {
    test("Then it should invoke the next function", async () => {
      landmarkModel.find = jest.fn().mockRejectedValue(null);
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await getLandmarks(null, res, next);

      expect(next).toHaveBeenCalledTimes(1);
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
          imageUrl: "image",
          category: "parque",
          coordinates: {
            latitude: 41.444914,
            longitude: 2.074983,
          },
          introduction: "hello",
          description: "this is a description",
        },
      };

      const res = mockResponse();
      const expectedStatus = 201;

      landmarkModel.findOne = jest.fn().mockResolvedValue(null);
      landmarkModel.create = jest.fn().mockResolvedValue(req.body);

      await createLandmark(req, res, null);

      expect(res.json).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
    describe("And Landmark create rejects", () => {
      test("Then it should invoke invoke next function with the error rejected", async () => {
        const error = new NewError();

        landmarkModel.create = jest.fn().mockRejectedValue(error);

        const req = {
          body: {
            title: "",
            city: "",
            imageUrl: "",
            coordinates: {
              latitude: 1,
              longitude: 2,
            },
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
  });
});
