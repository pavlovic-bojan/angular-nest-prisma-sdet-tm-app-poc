import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";

describe("AuthService", () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should login with demo credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      role: "admin",
    });

    const result = await service.login({
      email: "demo@example.com",
      password: "password123",
    });

    expect(result).toBeDefined();
    expect(result.email).toBe("demo@example.com");
    expect(result.name).toBe("Demo User");
    expect(result).not.toHaveProperty("password");
  });

  it("should throw on invalid credentials", async () => {
    await expect(
      service.login({ email: "wrong@test.com", password: "wrong" })
    ).rejects.toThrow(UnauthorizedException);
  });
});
