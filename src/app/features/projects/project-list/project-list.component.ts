import { Component, inject, computed, signal } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/services/project.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination.component';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [DateFormatPipe, DrawerComponent, ConfirmDialogComponent, TablePaginationComponent, ProjectFormComponent],
  template: `
    <div class="flex justify-between items-center mb-4 md:mb-6 gap-2 flex-wrap">
      <h2 class="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Projects</h2>
      <button
        (click)="openDrawer(null)"
        class="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition"
      >
        Add Project
      </button>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <div class="overflow-x-auto md:overflow-x-visible">
      <table class="w-full min-w-max">
        <thead class="bg-slate-100 dark:bg-slate-800 text-xs md:text-sm">
          <tr>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('name')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Name
                @if (sortColumn() === 'name') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('description')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Description
                @if (sortColumn() === 'description') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('createdAt')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Created
                @if (sortColumn() === 'createdAt') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (project of paginatedProjects(); track project.id) {
            <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td class="px-4 py-3">{{ project.name }}</td>
              <td class="px-4 py-3">{{ project.description }}</td>
              <td class="px-4 py-3">{{ project.createdAt | dateFormat }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    (click)="openDrawer(project.id)"
                    class="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    (click)="openDeleteConfirm(project.id, project.name)"
                    class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-slate-500">No projects yet</td>
            </tr>
          }
        </tbody>
      </table>
      </div>
      @if (projects().length > 0) {
        <app-table-pagination
          [totalItems]="sortedProjects().length"
          [currentPage]="currentPage()"
          [pageSize]="pageSize()"
          (pageChange)="currentPage.set($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        />
      }
    </div>

    <app-drawer
      [open]="drawerOpen"
      [title]="editingProjectId ? 'Edit Project' : 'New Project'"
      (close)="closeDrawer()"
    >
      <app-project-form
        [projectId]="editingProjectId"
        (closed)="closeDrawer()"
      />
    </app-drawer>

    <app-confirm-dialog
      [open]="deleteDialogOpen"
      [title]="'Delete project'"
      [message]="deleteConfirmMessage()"
      (confirm)="confirmDelete()"
      (cancel)="closeDeleteConfirm()"
    />
  `,
})
export class ProjectListComponent {
  private projectService = inject(ProjectService);

  sortColumn = signal<keyof Project | ''>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);
  private refreshTrigger = signal(0);

  projects = computed(() => {
    this.refreshTrigger();
    return this.projectService.getAll();
  });

  sortedProjects = computed(() => {
    const data = [...this.projects()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return data;
    return data.sort((a, b) => {
      const aVal = a[col] ?? '';
      const bVal = b[col] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  paginatedProjects = computed(() => {
    const data = this.sortedProjects();
    const start = (this.currentPage() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  drawerOpen = false;
  editingProjectId: string | null = null;

  deleteDialogOpen = false;
  itemToDelete: { id: string; name: string } | null = null;
  deleteConfirmMessage = computed(() =>
    this.itemToDelete
      ? `Are you sure you want to delete the project "${this.itemToDelete.name}"? This action cannot be undone.`
      : ''
  );

  sortBy(column: keyof Project): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'createdAt' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  openDrawer(projectId: string | null): void {
    this.editingProjectId = projectId;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingProjectId = null;
    this.refreshTrigger.update(v => v + 1);
  }

  openDeleteConfirm(id: string, name: string): void {
    this.itemToDelete = { id, name };
    this.deleteDialogOpen = true;
  }

  closeDeleteConfirm(): void {
    this.deleteDialogOpen = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      this.projectService.delete(this.itemToDelete.id);
      this.refreshTrigger.update(v => v + 1);
      this.currentPage.set(1);
      this.closeDeleteConfirm();
    }
  }
}
