import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserService } from "../../src/modules/user/user.service";
import { getPrisma } from "../../src/libs/prisma";
import { prismaMock } from "../__mocks__/prisma";

jest.mock("../../src/libs/prisma", () => ({
  getPrisma: jest.fn(),
}));

const JWT_SECRET = `${process.env.JWT_SECRET}`;
const mockGetPrisma = getPrisma as jest.MockedFunction<typeof getPrisma>;

describe("Creation of users | UserService", () => {
  let userService: UserService;
  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
    mockGetPrisma.mockResolvedValue(prismaMock);
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

    // const payload = jwt.verify(user.userToken, JWT_SECRET);
    // expect(payload).toHaveProperty("userId");

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
