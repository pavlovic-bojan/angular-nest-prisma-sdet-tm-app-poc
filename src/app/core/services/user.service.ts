import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private mockData: MockDataService) {}

  getAll(): User[] {
    return this.mockData.getUsers();
  }

  getById(id: string): User | undefined {
    return this.mockData.getUser(id);
  }

  create(user: Omit<User, 'id'>): User {
    return this.mockData.addUser(user);
  }

  update(id: string, updates: Partial<User>): User | undefined {
    return this.mockData.updateUser(id, updates);
  }

  delete(id: string): boolean {
    return this.mockData.deleteUser(id);
  }
}
