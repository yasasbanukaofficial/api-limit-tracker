import { Router } from "express";
import { ApiController } from "./api.controller";

const apiRouter = Router();
const apiController = new ApiController();

apiRouter.post("/", (req, res) => apiController.createAPIKey(req, res));

export default apiRouter;
