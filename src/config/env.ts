import { config } from "dotenv";

config();
const { DATABASE_URL, JWT_SECRET, NODE_ENV } = process.env;

export { DATABASE_URL, JWT_SECRET, NODE_ENV };
