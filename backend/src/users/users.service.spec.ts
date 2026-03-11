import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      role: 'developer',
      password: 'x',
    });

    const result = await service.create({
      name: 'Test',
      email: 'test@test.com',
      role: 'developer',
    });
    expect(result).toBeDefined();
    expect(result).not.toHaveProperty('password');
  });

  it('should throw ConflictException if email exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
    await expect(
      service.create({ name: 'Test', email: 'exists@test.com' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException when user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should findAll users', async () => {
    mockPrisma.user.findMany.mockResolvedValue([
      { id: '1', name: 'U1', email: 'u1@x.com', role: 'dev' },
    ]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should update user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.user.update.mockResolvedValue({
      id: '1',
      name: 'Updated',
      email: 'u@x.com',
      role: 'dev',
      password: 'x',
    });
    const result = await service.update('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
    expect(result).not.toHaveProperty('password');
  });

  it('should remove user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.user.delete.mockResolvedValue({} as never);
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'User deleted' });
  });
});
