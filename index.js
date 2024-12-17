import server from "./server.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000 

mongoose
  .connect(process.env.DB_URL)
  .then((data) => {
    server.listen(PORT, async () => {
      console.log(`DB connected & Server is running...Port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });
