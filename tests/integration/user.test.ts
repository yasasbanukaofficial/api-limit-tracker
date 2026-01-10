import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserService } from "../../src/modules/user/user.service";
import { getPrisma } from "../../src/libs/prisma";
import { prismaMock } from "../__mocks__/prisma";
import { UserController } from "../../src/modules/user/user.controller";
import { error, success } from "simple-api-responser";

jest.mock("../../src/libs/prisma", () => ({
  getPrisma: jest.fn(),
}));

const mockGetPrisma = getPrisma as jest.MockedFunction<typeof getPrisma>;

describe("Create user | UserService", () => {
  let userService: UserService;
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPrisma.mockResolvedValue(Promise.resolve(prismaMock));
    userService = new UserService(Promise.resolve(prismaMock));
  });

  it("should create a user with an email", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@mail.com",
      userToken: "RandomText",
    };
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUser);

    const user = await userService.createUser("johndoe", "john");

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("userToken");
    expect(user.email).toBe("john@mail.com");
  });

  it("should throw an error if email already exists", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      name: "johndoe",
      email: "john@mail.com",
    });

    await expect(
      userService.createUser("johndoe", "john@mail.com")
    ).rejects.toThrow("Email already exists");
  });
});

describe("Creation of users using controller | UserController", () => {
  const mockService: any = {
    createUser: jest.fn(),
  };
  const userController = new UserController(mockService);

  const user = { id: "1", name: "John", email: "john@mail.com" };
  const req: any = { body: { name: user.name, email: user.email } };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user successfully", async () => {
    mockService.createUser.mockResolvedValue(user);
    await userController.createUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Fetched user successfully",
      status: 200,
      data: user,
    });
  });

  it("returns error if email exists", async () => {
    mockService.createUser.mockRejectedValue(new Error("Email already exists"));
    await userController.createUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email already exists",
      status: 409,
    });
  });

  it("returns internal server error", async () => {
    mockService.createUser.mockRejectedValue(
      new Error("Internal Server Error")
    );
    await userController.createUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  });
});
