import { ZooController } from "../../controller/administration/zoo.controller";
import { Zoo, ZooModel } from "../../models/zoo.model"
import { Response, Request } from 'express';

jest.mock("../../models/zoo.model");

describe("ZooController - getZoo", () => {
  let zooController: ZooController;

  beforeEach(() => {
    zooController = new ZooController();

    // Mocking ZooModel.findOne and populate functions
    (ZooModel.findOne as jest.Mock).mockImplementation(() => ({
      populate: () => ({
        populate: () => ({
          exec: () => Promise.resolve({}),
        }),
      }),
    }));
  });

  it("gets the Zoo successfully", async () => {
    const req = {} as Request;
    const res = {
      status: function() {
        return this;
      },
      json: jest.fn(),
    } as unknown as Response;

    await zooController.getZoo(req, res);
    
    expect(res.json).toHaveBeenCalled();
  });
});
