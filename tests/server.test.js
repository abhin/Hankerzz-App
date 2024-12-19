import supertest from "supertest";
import server from "../server.js";
import { URL } from "../utilities/constants.js";

describe("Server Endpoints", () => {
  test("GET /healthcheck should return server health status", async () => {
    const response = await supertest(server).get(`${URL}/healthcheck`);
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("Server health is good");
  });

  test("GET /auth route should exist", async () => {
    const response = await supertest(server).get(`${URL}/auth/google`);
    expect(response.status).not.toEqual(404);
  });

  test("GET /user route should exist", async () => {
    const response = await supertest(server).post(`${URL}/user/signup`);
    expect(response.status).not.toEqual(404);
  });

  test("Should allow cross-origin supertests", async () => {
    const response = await supertest(server)
      .get(`${URL}/healthcheck`)
      .set("Origin", "http://google.com");
    expect(response.status).toEqual(200);
    expect(response.headers["access-control-allow-origin"]).toEqual("*");
  });

  test("Should parse JSON body in supertests", async () => {
    const sampleData = { key: "value" };
    const response = await supertest(server)
      .post(`${URL}/auth/login`)
      .send(sampleData)
      .set("Content-Type", "application/json");
    expect(response.status).not.toEqual(404); // Check route existence
    expect(response.headers["content-type"]).toMatch(/json/);
  });
});