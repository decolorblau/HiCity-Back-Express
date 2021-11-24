/* eslint-disable import/first */
import dotenv from "dotenv";

dotenv.config();
import connectDB from "./database";
import { initializeServer } from "./server/index";

const PORT = process.env.PORT ?? process.env.SERVER_PORT ?? 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_HICITY);
    await initializeServer(PORT);
  } catch (error) {
    process.exit(1);
  }
})();
