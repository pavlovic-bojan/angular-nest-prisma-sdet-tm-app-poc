import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create project', async () => {
    mockPrisma.project.create.mockResolvedValue({
      id: '1',
      name: 'P1',
      description: 'Desc',
    });
    const result = await service.create({ name: 'P1', description: 'Desc' });
    expect(result.name).toBe('P1');
  });

  it('should throw NotFoundException when project not found', async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should findAll projects', async () => {
    mockPrisma.project.findMany.mockResolvedValue([
      { id: '1', name: 'P1', description: 'D1', createdAt: new Date() },
    ]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should update project', async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.project.update.mockResolvedValue({
      id: '1',
      name: 'Updated',
      description: 'D1',
      createdAt: new Date(),
    });
    const result = await service.update('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should remove project', async () => {
    mockPrisma.project.findUniqueOrThrow.mockResolvedValue({ id: '1' });
    mockPrisma.project.delete.mockResolvedValue({} as never);
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'Project deleted' });
  });
});
