/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();

import Debug from "debug";
import bcrypt from "bcrypt";
import chalk from "chalk";
import mongoose from "mongoose";
import supertest from "supertest";
import initializeDB from "../../database";
import UserModel from "../../database/models/UserModel";
import { initializeServer, app } from "../index";

const request = supertest(app);
const debug = Debug("HiCity:userRoutesTests");
let server;

class NewError extends Error {
  code: number | undefined;
}

beforeAll(async () => {
  await initializeDB(process.env.MONGODB_HICITY_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});

beforeEach(async () => {
  await UserModel.deleteMany();
  await UserModel.create({
    _id: "640abb654c10e9728eef586f",
    __v: 0,
    name: "Mar",
    email: "blau@blau.com",
    password: await bcrypt.hash("soymar", 10),
    folders: [],
  });
});

afterAll((done) => {
  server.close(async () => {
    await mongoose.connection.close();
    debug(chalk.red("Connexion to database ended"));
    debug(chalk.red("Connexion to server ended"));
    done();
  });
});

describe("Given the /login endpoint", () => {
  describe("When it receives a POST request with a valid email and password", () => {
    test("Then it should return a 200 status", async () => {
      const { body } = await request
        .post("/user/login")
        .send({ email: "blau@blau.com", password: "soymar" })
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });
  describe("When it receives a POST request with a wrong email and password", () => {
    test("Then it should return a 401 status", async () => {
      const { body } = await request
        .post("/user/login")
        .send({ email: "blau@blau.com", password: "test" })
        .expect(401);

        const error = new NewError("Wrong credentials")

      expect(body).toEqual(error);
    });
  });
})

describe("Given a /register endpoint", () => {
  describe("When a POST request arrives with an already existing email", () => {
    test("Then it should respond with a 400 error", async () => {
      const { body } = await request
        .post("/user/register")
        .send({
          name: "Mar",
          email: "blau@blau.com",
          password: "soymar",
        })
        .expect(400);

        const error = new NewError("This email is already registered")

      expect(body).toEqual(error);
    });
  });
  describe("When a POST request arrives with a non existent email, a name and a password", () => {
    test("Then it should respond with a 201", async () => {
      const { body } = await request
        .post("/users/register")
        .send({
          email: "test@test.com",
          password: "testeando",
          name: "testeador",
        })
        .expect(201);

      expect(body).toHaveProperty("email" && "password");
      expect(body).toHaveProperty("email", "test@test.com");

    });
  });
});