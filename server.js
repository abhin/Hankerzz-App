import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import customersRouters from "./routes/customers.js";
import authRouters from "./routes/auth.js";
import { URL } from "./utilities/constants.js";

dotenv.config();

const server = express();
server.use(bodyParser.json());
server.use(cors({ orgin: '*' }));
server.use(`${URL}/auth`, authRouters);
server.use(`${URL}/customer`, customersRouters);

server.get(`${URL}/healthcheck`, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server health is good",
  });
});

export default server;
