import { Component, inject, computed, signal } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [StatusLabelPipe, DateFormatPipe, DrawerComponent, ConfirmDialogComponent, TablePaginationComponent, TaskFormComponent],
  template: `
    <div class="flex justify-between items-center mb-4 md:mb-6 gap-2 flex-wrap">
      <h2 class="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Tasks</h2>
      <button
        (click)="openDrawer(null)"
        class="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition"
      >
        Add Task
      </button>
    </div>
    <div class="bg-white dark:bg-slate-900 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <div class="overflow-x-auto md:overflow-x-visible">
      <table class="w-full min-w-max">
        <thead class="bg-slate-100 dark:bg-slate-800 text-xs md:text-sm">
          <tr>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('title')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Title
                @if (sortColumn() === 'title') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('status')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Status
                @if (sortColumn() === 'status') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('priority')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Priority
                @if (sortColumn() === 'priority') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('projectId')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Project
                @if (sortColumn() === 'projectId') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-left">
              <button
                (click)="sortBy('updatedAt')"
                class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Updated
                @if (sortColumn() === 'updatedAt') {
                  <span>{{ sortDirection() === 'asc' ? '↑' : '↓' }}</span>
                }
              </button>
            </th>
            <th class="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (task of paginatedTasks(); track task.id) {
            <tr class="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td class="px-4 py-3">{{ task.title }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  [class]="getStatusClass(task.status)"
                >
                  {{ task.status | statusLabel }}
                </span>
              </td>
              <td class="px-4 py-3">{{ task.priority | statusLabel }}</td>
              <td class="px-4 py-3">{{ getProjectName(task.projectId) }}</td>
              <td class="px-4 py-3">{{ task.updatedAt | dateFormat }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <button
                    (click)="openDrawer(task.id)"
                    class="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button
                    (click)="openDeleteConfirm(task.id, task.title)"
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
              <td colspan="6" class="px-4 py-8 text-center text-slate-500">No tasks yet</td>
            </tr>
          }
        </tbody>
      </table>
      </div>
      @if (tasks().length > 0) {
        <app-table-pagination
          [totalItems]="sortedTasks().length"
          [currentPage]="currentPage()"
          [pageSize]="pageSize()"
          (pageChange)="currentPage.set($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        />
      }
    </div>

    <app-drawer
      [open]="drawerOpen"
      [title]="editingTaskId ? 'Edit Task' : 'New Task'"
      (close)="closeDrawer()"
    >
      <app-task-form
        [taskId]="editingTaskId"
        (closed)="closeDrawer()"
      />
    </app-drawer>

    <app-confirm-dialog
      [open]="deleteDialogOpen"
      [title]="'Delete task'"
      [message]="deleteConfirmMessage()"
      (confirm)="confirmDelete()"
      (cancel)="closeDeleteConfirm()"
    />
  `,
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);

  sortColumn = signal<keyof Task | ''>('updatedAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  currentPage = signal(1);
  pageSize = signal(10);
  private refreshTrigger = signal(0);

  tasks = computed(() => {
    this.refreshTrigger();
    return this.taskService.getAll();
  });
  projects = this.projectService.getAll();

  sortedTasks = computed(() => {
    const data = [...this.tasks()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (!col) return data;
    return data.sort((a, b) => {
      let aVal: string | number = a[col as keyof Task] ?? '';
      let bVal: string | number = b[col as keyof Task] ?? '';
      if (col === 'projectId') {
        aVal = this.getProjectName(aVal as string);
        bVal = this.getProjectName(bVal as string);
      }
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  paginatedTasks = computed(() => {
    const data = this.sortedTasks();
    const start = (this.currentPage() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  drawerOpen = false;
  editingTaskId: string | null = null;

  deleteDialogOpen = false;
  itemToDelete: { id: string; name: string } | null = null;
  deleteConfirmMessage = computed(() =>
    this.itemToDelete
      ? `Are you sure you want to delete the task "${this.itemToDelete.name}"? This action cannot be undone.`
      : ''
  );

  sortBy(column: keyof Task): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'updatedAt' ? 'desc' : 'asc');
    }
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  openDrawer(taskId: string | null): void {
    this.editingTaskId = taskId;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.editingTaskId = null;
    this.refreshTrigger.update(v => v + 1);
  }

  getProjectName(id: string): string {
    return this.projectService.getById(id)?.name ?? '-';
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      todo: 'bg-slate-200 text-slate-700',
      'in-progress': 'bg-amber-200 text-amber-800',
      done: 'bg-green-200 text-green-800',
    };
    return map[status] ?? 'bg-slate-200';
  }

  openDeleteConfirm(id: string, title: string): void {
    this.itemToDelete = { id, name: title };
    this.deleteDialogOpen = true;
  }

  closeDeleteConfirm(): void {
    this.deleteDialogOpen = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      this.taskService.delete(this.itemToDelete.id);
      this.refreshTrigger.update(v => v + 1);
      this.currentPage.set(1);
      this.closeDeleteConfirm();
    }
  }
}
