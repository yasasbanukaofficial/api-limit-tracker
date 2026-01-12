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
      return res.status(500).json(error(err.message, 500));
    }
  }

  async updateUser(req: Request, res: Response) {
    const { name, email } = req.body as { name: string; email: string };
    try {
      const user = await this.userService.updateUser(name, email);
      return res
        .status(200)
        .json(success(user, "User updated successfully", 200));
    } catch (err: any) {
      return res.status(500).json(error(err.message, 500));
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    try {
      await this.userService.deleteUser(email);
      return res.status(200).json(success("User deleted successfully"));
    } catch (err: any) {
      return res.status(500).json(error(err.message, 500));
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
      if (err.message === "User doesn't exist") {
        return res.status(404).json(error(err.message, 404));
      }
      return res.status(500).json(error(err.message, 500));
    }
  }
}
