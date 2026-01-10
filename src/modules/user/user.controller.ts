import { Request, Response } from "express";
import { UserService } from "./user.service";
import { success, error } from "simple-api-responser";

const userService = new UserService();

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    const { name, email } = req.body as { name: string; email: string };
    try {
      const user = await this.userService.createUser(name, email);
      return res.json(success(user, "Fetched user successfully", 200));
    } catch (err: any) {
      if (err.message === "Email already exists") {
        return res.json(error("Email already exists", 409));
      }
      return res.json(error("Internal Server Error", 500));
    }
  }
}
