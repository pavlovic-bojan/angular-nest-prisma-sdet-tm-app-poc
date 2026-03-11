import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  const mockPrisma = {
    task: {
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
        TasksService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create task', async () => {
    mockPrisma.task.create.mockResolvedValue({
      id: '1',
      title: 'T1',
      status: 'todo',
      priority: 'medium',
      projectId: 'p1',
    });
    const result = await service.create({
      title: 'T1',
      projectId: 'p1',
    });
    expect(result.title).toBe('T1');
  });

  it('should throw NotFoundException when task not found', async () => {
    mockPrisma.task.findUnique.mockResolvedValue(null);
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should findAll tasks', async () => {
    mockPrisma.task.findMany.mockResolvedValue([
      { id: '1', title: 'T1', projectId: 'p1' } as never,
    ]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
  });

  it('should findAll tasks filtered by projectId', async () => {
    mockPrisma.task.findMany.mockResolvedValue([]);
    await service.findAll('proj-1');
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { projectId: 'proj-1' } }),
    );
  });

  it('should update task', async () => {
    mockPrisma.task.update.mockResolvedValue({
      id: '1',
      title: 'Updated',
      projectId: 'p1',
    } as never);
    const result = await service.update('1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should remove task', async () => {
    mockPrisma.task.findUniqueOrThrow.mockResolvedValue({ id: '1' });
    mockPrisma.task.delete.mockResolvedValue({} as never);
    const result = await service.remove('1');
    expect(result).toEqual({ message: 'Task deleted' });
  });
});
