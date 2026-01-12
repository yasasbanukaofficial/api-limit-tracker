export const prismaMock = {
  user: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  apiKey: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};
