import supertest from "supertest";
import mongoose from "mongoose";
import Users from "../models/users";
import server from "../server";
import { URL } from "../utilities/constants";

beforeAll(async () => {
  
});

beforeEach(() => {
  Users.deleteMany();
});

describe("Signup test cases", () => {
  it("Login Test", async () => {
    // const response = await supertest(server).post(`${URL}/auth/login`);
    console.log('test success');
  });
});
