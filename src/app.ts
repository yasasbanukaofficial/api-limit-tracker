import express from "express";
import { PORT } from "./config/env";
import userRouter from "./modules/user/user.routes";
import apiRouter from "./modules/api/api.routes";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
