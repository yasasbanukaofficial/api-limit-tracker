import { Router } from "express";
import { UserController } from "./user.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/create", (req, res) => userController.createUser(req, res));
userRouter.post("/update", (req, res) => userController.updateUser(req, res));
userRouter.post("/delete", (req, res) => userController.deleteUser(req, res));

export default userRouter;
