import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private mockData: MockDataService) {}

  getAll(): Task[] {
    return this.mockData.getTasks();
  }

  getById(id: string): Task | undefined {
    return this.mockData.getTask(id);
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    return this.mockData.addTask(task);
  }

  update(id: string, updates: Partial<Task>): Task | undefined {
    return this.mockData.updateTask(id, updates);
  }

  delete(id: string): boolean {
    return this.mockData.deleteTask(id);
  }
}
