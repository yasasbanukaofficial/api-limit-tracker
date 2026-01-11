import { Request, Response } from "express";
import { UserService } from "./user.service";
import { success, error } from "simple-api-responser";

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  async createUser(req: Request, res: Response) {
    const { name, email } = req.body as { name: string; email: string };
    try {
      const user = await this.userService.createUser(name, email);
      return res
        .status(200)
        .json(success(user, "Fetched user successfully", 200));
    } catch (err: any) {
      if (err.message === "Email already exists") {
        return res.status(409).json(error("Email already exists", 409));
      }
      return res.status(500).json(error("Internal Server Error", 500));
    }
  }

  async findUser(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    try {
      const user = await this.userService.findUser(email);
      return res
        .status(200)
        .json(success(user, "Fetched user successfully", 200));
    } catch (err: any) {
      if (err.message === "User does not exist") {
        return res.status(404).json(error(err.message, 404));
      }
      return res.status(500).json(error("Internal Server Error", 500));
    }
  }
}
