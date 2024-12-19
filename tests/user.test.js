import supertest from "supertest";
import server from "../server";
import { URL } from "../utilities/constants";
import { generateAccessToken } from "../utilities/function";

let validUserId;

describe("User Routes", () => {
  it("should create a user and return 200 with success message", async () => {
    const user = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      roleId: 1,
      sendEmail: false,
    };

    const response = await supertest(server).post(`${URL}/user/signup`).send(user);

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual(
      "Account created successfully. Please check your email for activation."
    );
    validUserId = response?.body?.user?._id;
  });

  it("should return 400 for missing fields in user creation", async () => {
    const user = {
      name: "Test User",
      email: "testuser@example.com",
    };

    const response = await supertest(server).post(`${URL}/user/signup`).send(user);

    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toContain("Password is required");
  });

  it("should get all users with 200 status", async () => {
    const response = await supertest(server).get(`${URL}/user/read`);

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(Array.isArray(response.body.users)).toEqual(true);
  });

  it("should return 200 for successful update", async () => {
    const updatedUser = {
      name: "Updated User",
      email: "updateduser@example.com",
      password: "newpassword123",
    };

    const response = await supertest(server)
      .put(`${URL}/user/update`)
      .send({ ...updatedUser, _id: validUserId });

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("Users updated successfully.");
  });

  it("should return 404 for updating non-existing user", async () => {
    const updatedUser = {
      name: "Updated User",
      email: "updateduser@example.com",
    };

    const response = await supertest(server)
      .put(`${URL}/user/update`)
      .send({ ...updatedUser, _id: "non-existing-id" });

    expect(response.status).toEqual(404);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("User ID not found.");
  });

  it("should return 200 for successful user activation", async () => {
    const token = generateAccessToken(validUserId);

    const response = await supertest(server).get(`${URL}/user/activate/${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("Account activated successfully.");
  });

  it("should return 401 for invalid activation token", async () => {
    const invalidToken = "invalid-token";

    const response = await supertest(server).get(
      `${URL}/user/activate/${invalidToken}`
    );

    expect(response.status).toEqual(401);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Invalid token. Authentication failed.");
  });

  it("should return 400 for already activated account", async () => {
    const token = "already-activated-token"; // Replace with token of already activated user

    const response = await supertest(server).get(`${URL}/user/activate/${token}`);

    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual("Account is already activated.");
  });
});

it("should return 200 for successful user deletion", async () => {
  const response = await supertest(server).delete(
    `${URL}/user/delete/${validUserId}`
  );

  expect(response.status).toEqual(200);
  expect(response.body.success).toEqual(true);
  expect(response.body.message).toEqual(
    `Users deleted successfully. ID: ${validUserId}`
  );
});

it("should return 404 for deleting non-existing user", async () => {
  const response = await supertest(server).delete(
    `${URL}/user/delete/non-existing-id`
  );

  expect(response.status).toEqual(404);
  expect(response.body.success).toEqual(false);
  expect(response.body.message).toEqual("User does not exist.");
});
