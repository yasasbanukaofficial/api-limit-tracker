import { config } from "dotenv";

config();
const { DATABASE_URL, JWT_SECRET, NODE_ENV, PORT } = process.env;

export { DATABASE_URL, JWT_SECRET, NODE_ENV, PORT };
