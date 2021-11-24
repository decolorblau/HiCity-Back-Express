import landmarkModel from "../../database/models/landMarks";
import getLandmarks from "./landmarkController";

describe("Given the getPlatforms function", () => {
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
