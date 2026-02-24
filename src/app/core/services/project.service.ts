import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private mockData: MockDataService) {}

  getAll(): Project[] {
    return this.mockData.getProjects();
  }

  getById(id: string): Project | undefined {
    return this.mockData.getProject(id);
  }

  create(project: Omit<Project, 'id' | 'createdAt'>): Project {
    return this.mockData.addProject(project);
  }

  update(id: string, updates: Partial<Project>): Project | undefined {
    return this.mockData.updateProject(id, updates);
  }

  delete(id: string): boolean {
    return this.mockData.deleteProject(id);
  }
}
