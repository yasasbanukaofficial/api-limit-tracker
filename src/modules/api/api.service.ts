import "dotenv/config";
import crypto from "crypto";
import { getPrisma } from "../../libs/prisma";
import { connect } from "http2";

export class ApiService {
  private prisma: any;
  constructor(prisma?: any) {
    this.prisma = prisma || getPrisma();
  }
  async createAPIKey(email: string) {
    const prisma = await this.prisma;
    const existing = await prisma.user.findUnique({
      where: { email },
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
        isActive: true,
        user: {
          connect: {
            id: existing.id,
          },
        },
      },
    });
  }
}
