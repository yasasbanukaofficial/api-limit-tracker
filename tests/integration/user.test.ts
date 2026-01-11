import "dotenv/config";
import { UserService } from "../../src/modules/user/user.service";
import { prismaMock } from "../__mocks__/prisma";
import { UserController } from "../../src/modules/user/user.controller";

jest.mock("../../src/libs/prisma", () => ({
  getPrisma: jest.fn(),
}));

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@mail.com",
  userToken: "RandomText",
};

describe("User operations | UserService", () => {
  let userService: UserService;
  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(Promise.resolve(prismaMock));
  });

  it("should create a user with an email", async () => {
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

  it("should return the user details", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const user = await userService.findUser(mockUser.email);
    expect(user).toHaveProperty("id");
  });

  it("should throw an error if email does not exist", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(userService.findUser("nonexistent@mail.com")).rejects.toThrow(
      "User doesn't exist"
    );
  });
});

describe("CRUD operations | UserController", () => {
  const mockService: any = {
    createUser: jest.fn(),
    findUser: jest.fn(),
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

  it("should return an error if email exists", async () => {
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

  it("returns the user details when email is sent as a parameter", async () => {
    mockService.findUser.mockResolvedValue(user);
    const req: any = { body: { email: "test@m.com" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await userController.findUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Fetched user successfully",
      status: 200,
      data: user,
    });
  });

  it("should return an error if User doesn't exist", async () => {
    mockService.findUser.mockRejectedValue(new Error("User doesn't exist"));
    await userController.findUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User doesn't exist",
      status: 404,
    });
  });

  it("should throw an internal server error if anything fails", async () => {
    mockService.findUser.mockRejectedValue(new Error("Internal Server Error"));
    await userController.findUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  });
});
