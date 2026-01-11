import { Request, Response } from "express";
import { ApiService } from "./api.service";
import { error, success } from "simple-api-responser";
import { UserService } from "../user/user.service";

export class ApiController {
  constructor(
    private apiService: ApiService = new ApiService(),
    private userService: UserService = new UserService()
  ) {}
  async createAPIKey(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    try {
      const user = await this.userService.findUser(email);
      const apiKey = await this.apiService.createAPIKey(user.email);

      return res
        .status(200)
        .json(
          success({ userId: user.id, apiKey }, "Fetched user successfully")
        );
    } catch (err: any) {
      if (
        err.message === "User doesn't exist" ||
        err.message === "API Key generation limit exceed" ||
        err.message === "Error when getting an API key"
      ) {
        return res.status(409).json(error(err.message, 409));
      }
      return res.status(500).json(error("Internal Server Error", 500));
    }
  }
}
