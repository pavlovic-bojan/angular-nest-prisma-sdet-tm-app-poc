import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

const DEMO_CREDENTIALS = [
  { email: "demo@example.com", password: "password123", name: "Demo User", role: "admin" },
];

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const user = DEMO_CREDENTIALS.find((u) => u.email === dto.email && u.password === dto.password);
    if (!user) throw new UnauthorizedException("Invalid email or password");
    let dbUser = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) {
      dbUser = await this.prisma.user.create({
        data: { email: user.email, name: user.name, password: user.password, role: user.role },
      });
    }
    const { password, ...result } = dbUser;
    return result;
  }
}
