import supertest from "supertest";
import mongoose from "mongoose";
import Customers from "../modals/customers";
import server from "../server";
import { URL } from "../utilities/constants";

beforeAll(async () => {
  
});

beforeEach(() => {
  Customers.deleteMany();
});

describe("Signup test cases", () => {
  it("Login Test", async () => {
    // const response = await supertest(server).post(`${URL}/auth/login`);
    console.log('test success');
  });
});
