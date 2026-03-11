import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Setup project',
      description: 'Initialize Angular project with Tailwind',
      status: 'done',
      priority: 'high',
      projectId: '1',
      assigneeId: '1',
      createdAt: '2025-02-20T10:00:00Z',
      updatedAt: '2025-02-21T14:00:00Z',
    },
    {
      id: '2',
      title: 'Implement auth',
      description: 'Add login/logout with mock user',
      status: 'in-progress',
      priority: 'high',
      projectId: '1',
      assigneeId: '1',
      createdAt: '2025-02-21T09:00:00Z',
      updatedAt: '2025-02-22T11:00:00Z',
    },
    {
      id: '3',
      title: 'Create task list',
      description: 'Build task CRUD functionality',
      status: 'todo',
      priority: 'medium',
      projectId: '1',
      createdAt: '2025-02-22T08:00:00Z',
      updatedAt: '2025-02-22T08:00:00Z',
    },
  ];

  private users: User[] = [
    { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'developer' },
    { id: '3', name: 'John Smith', email: 'john@example.com', role: 'developer' },
  ];

  private projects: Project[] = [
    {
      id: '1',
      name: 'Angular Task Manager',
      description: 'Main project for task management app',
      createdAt: '2025-02-20T10:00:00Z',
    },
    {
      id: '2',
      name: 'Side Project',
      description: 'Personal side project',
      createdAt: '2025-02-15T09:00:00Z',
    },
  ];

  // Tasks
  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTask(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    const now = new Date().toISOString();
    this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: now };
    return this.tasks[index];
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  // Users
  getUsers(): User[] {
    return [...this.users];
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Projects
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: now,
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    this.projects[index] = { ...this.projects[index], ...updates };
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    return true;
  }
}
