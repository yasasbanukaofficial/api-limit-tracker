import "dotenv/config";
import crypto from "crypto";
import { getPrisma } from "../../libs/prisma";

export class ApiService {
  private prisma: any;
  constructor(prisma?: any) {
    this.prisma = prisma || getPrisma();
  }
  async createAPIKey(userId: string) {
    const prisma = await this.prisma;
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      include: { apiKeys: true },
    });

    if (!existing) {
      throw new Error("User doesn't exists");
    }

    const apiKeys = existing.apiKeys ?? [];

    if (apiKeys.length >= 3) {
      throw new Error("API Key generation limit exceed");
    }

    const apiKey = `ak_live${crypto.randomBytes(32).toString("hex")}`;
    return await prisma.apiKey.create({
      data: {
        key: apiKey,
        userId,
        isActive: true,
      },
    });
  }
}
