import { ApiService } from "../../src/modules/api/api.service";
import { ApiController } from "../../src/modules/api/api.controller";
import { prismaMock } from "../__mocks__/prisma";
import { isAbsolute } from "node:path";

jest.mock("../../src/libs/prisma", () => ({
  getPrisma: jest.fn(),
}));

describe("api key creation | ApiService", () => {
  let apiService: ApiService;
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@mail.com",
    userToken: "RandomText",
  };
  beforeEach(() => {
    jest.clearAllMocks();
    apiService = new ApiService(prismaMock);
    prismaMock.apiKey.create.mockResolvedValue({
      id: "id",
      key: [],
      userId: "userId",
      isActive: false,
    });
  });

  it("should generate a api key", async () => {
    prismaMock.user.findUnique
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce(null);

    const result = await apiService.createAPIKey("user-id");
    expect(result).toHaveProperty("key");
    expect(prismaMock.apiKey.create).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if an user is not found", async () => {
    prismaMock.apiKey.findUnique.mockResolvedValue(null);
    await expect(apiService.createAPIKey("user-id")).rejects.toThrow(
      "User doesn't exists"
    );
  });

  it("should throw an error if api key count exceed 3", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      ...mockUser,
      apiKeys: [
        { id: "1", key: "ak_live_1" },
        { id: "2", key: "ak_live_2" },
        { id: "3", key: "ak_live_3" },
        { id: "4", key: "ak_live_4" },
      ],
    });

    await expect(apiService.createAPIKey("user-id")).rejects.toThrow(
      "API Key generation limit exceed"
    );
  });
});

describe("api key creation | ApiController", () => {
  const mockAPIService: any = {
    createAPIKey: jest.fn(),
  };

  const mockUserService: any = {
    findUser: jest.fn(),
  };

  const apiController = new ApiController(mockAPIService, mockUserService);
  const req: any = {
    body: {
      email: "test@m.com",
    },
  };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an API key successfully", async () => {
    mockUserService.findUser.mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@mail.com",
      userToken: "RandomText",
    });
    mockAPIService.createAPIKey.mockResolvedValue({
      key: "",
      email: "",
      isActive: true,
    });
    await apiController.createAPIKey(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Fetched user successfully",
      status: 200,
      data: {
        apiKey: { email: "", isActive: true, key: "" },
        userId: "1",
      },
    });
  });

  it("should throw an error if the user doesn't exist", async () => {
    mockAPIService.createAPIKey.mockRejectedValue(
      new Error("User doesn't exist")
    );
    await apiController.createAPIKey(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User doesn't exist",
      status: 409,
    });
  });

  it("should throw an error if apiKey is not created", async () => {
    mockAPIService.createAPIKey.mockRejectedValue(
      new Error("Error when getting an API key")
    );

    await apiController.createAPIKey(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Error when getting an API key",
      status: 409,
    });
  });

  it("should throw an internal server error if anything fails", async () => {
    mockAPIService.createAPIKey.mockRejectedValue(
      new Error("Internal Server Error")
    );
    await apiController.createAPIKey(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  });
});
