import { Injectable, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = inject(ApiService);

  getAll(): Promise<Task[]> {
    return firstValueFrom(this.api.get<Task[]>('/tasks'));
  }

  getById(id: string): Promise<Task | undefined> {
    return firstValueFrom(this.api.get<Task>(`/tasks/${id}`)).catch(() => undefined);
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return firstValueFrom(this.api.post<Task>('/tasks', task));
  }

  update(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    return firstValueFrom(this.api.put<Task>(`/tasks/${id}`, updates)).catch(() => undefined);
  }

  delete(id: string): Promise<boolean> {
    return firstValueFrom(this.api.delete<{ message: string }>(`/tasks/${id}`))
      .then(() => true)
      .catch(() => false);
  }
}
