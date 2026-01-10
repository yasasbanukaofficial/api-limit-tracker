import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserService } from "../../src/modules/user/user.service.js";

const JWT_SECRET = process.env.JWT_SECRET!;

describe("Creation of users | UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it("should create a user with an email", async () => {
    const user = await userService.createUser("johndoe", "john@mail.com");

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("userToken");

    const payload = jwt.verify(user.userToken, JWT_SECRET);
    expect(payload).toHaveProperty("userId");

    expect(user.email).toBe("john@mail.com");
  });

  it("should throw an error if email already exists", async () => {
    await userService.createUser("johndoe", "john@mail.com");

    expect(userService.createUser("johndoe", "john@mail.com")).rejects.toThrow(
      "Email already exists"
    );
  });
});
