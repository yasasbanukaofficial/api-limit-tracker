import { ApiService } from "../../src/modules/api/api.service";
import { getPrisma } from "../../src/libs/prisma";

jest.mock("../../src/libs/prisma", () => ({
  getPrisma: jest.fn(),
}));

const mockPrisma = getPrisma as jest.MockedFunction<typeof getPrisma>;

describe("api key creation", () => {
  let apiService: ApiService;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    apiKey: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@mail.com",
    userToken: "RandomText",
  };
  beforeEach(() => {
    jest.clearAllMocks();
    apiService = new ApiService(prismaMock);
  });

  it("should generate a api key", async () => {
    prismaMock.apiKey.create.mockResolvedValue({
      id: "id",
      key: [],
      userId: "userId",
      isActive: false,
    });
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
