import {config} from "dotenv";
config({ path: '.env.test' });

const request = require("supertest");
import mongoose from "mongoose";
import app from "../app"
import { RoleModel, UserModel } from "../models";
import { before } from "node:test";

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST as string, {auth: {
            username: process.env.MANGODB_USER as string,
            password: process.env.MANGODB_PASSWORD as string
        },
        authSource: "admin"
    })

});
  
afterAll(async () => {
    await UserModel.deleteMany({});
    await mongoose.disconnect();
});

describe("HealthCheck", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/")
    expect(response.statusCode).toBe(200)
  })
})

describe('AnimalController', () => {
  test('Make an animal OK', async () => {
    const animal = {
      name: 'Lion',
      sex: false,
      date: '<2023-05-25>',
    };

    const response = await request(app)
      .post('/animal')
      .send(animal)
      .expect(201)

      // console.log('Response status:', response.status);
      // console.log('Response body:', response.body);


    expect(response.body).toHaveProperty('_id');
  });
});