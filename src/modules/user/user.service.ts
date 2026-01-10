import "dotenv/config";
import jwt from "jsonwebtoken";
import { getPrisma } from "../../libs/prisma";

const JWT_SECRET = `${process.env.JWT_SECRET}`;

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

    const userObj = { name, email };

    const token = jwt.sign(userObj, JWT_SECRET);

    return await prisma.user.create({
      data: {
        ...userObj,
        userToken: token,
      },
    });
  }
}
