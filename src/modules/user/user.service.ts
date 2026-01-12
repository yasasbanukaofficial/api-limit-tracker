import "dotenv/config";
import { getPrisma } from "../../libs/prisma";

export class UserService {
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma || getPrisma();
  }

  async createUser(name: string, email: string) {
    const prisma = await this.prisma;
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("Email already exists");
    }

    return await prisma.user.create({
      data: { name, email },
    });
  }

  async updateUser(name: string, email: string) {
    const prisma = await this.prisma;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    return await prisma.user.update({
      where: { email },
      data: { name, email },
    });
  }

  async deleteUser(email: string) {
    const prisma = await this.prisma;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    return await prisma.user.delete({
      where: {
        email,
      },
    });
  }

  async findUser(email: string) {
    const prisma = await this.prisma;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User doesn't exist");
    }
    return user;
  }
}
