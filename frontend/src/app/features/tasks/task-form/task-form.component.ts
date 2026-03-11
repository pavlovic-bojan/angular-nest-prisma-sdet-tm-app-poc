import { Component, inject, input, output, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { UserService } from '../../../core/services/user.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4" data-testid="task-form">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
        <input
          type="text"
          formControlName="title"
          data-testid="task-title"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
        />
        @if (form.get('title')?.invalid && form.get('title')?.touched) {
          <p class="text-red-500 text-xs mt-1">Title is required</p>
        }
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea
          formControlName="description"
          data-testid="task-description"
          rows="3"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
        ></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status *</label>
          <select
            formControlName="status"
            data-testid="task-status"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority *</label>
          <select
            formControlName="priority"
            data-testid="task-priority"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project *</label>
          <select
            formControlName="projectId"
            data-testid="task-project"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
          >
            @for (p of projects(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assignee</label>
          <select
            formControlName="assigneeId"
            data-testid="task-assignee"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
          >
            <option value="">None</option>
            @for (u of users(); track u.id) {
              <option [value]="u.id">{{ u.name }}</option>
            }
          </select>
        </div>
      </div>
      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          [disabled]="form.invalid"
          data-testid="task-form-submit"
          class="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button
          type="button"
          (click)="closed.emit()"
          data-testid="task-form-cancel"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  `,
})
export class TaskFormComponent {
  taskId = input<string | null>(null);

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);

  projects = signal<{ id: string; name: string }[]>([]);
  users = signal<{ id: string; name: string }[]>([]);
  isEdit = false;

  closed = output<void>();

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: ['todo' as Task['status'], Validators.required],
    priority: ['medium' as Task['priority'], Validators.required],
    projectId: ['', Validators.required],
    assigneeId: [''],
  });

  constructor() {
    Promise.all([
      this.projectService.getAll(),
      this.userService.getAll(),
    ]).then(([p, u]) => {
      this.projects.set(p);
      this.users.set(u);
    });
    effect(() => {
      const id = this.taskId();
      if (id) {
        this.isEdit = true;
        this.taskService.getById(id).then((task) => {
          if (task) {
            this.form.patchValue({
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              priority: task.priority,
              projectId: task.projectId,
              assigneeId: task.assigneeId ?? '',
            });
          }
        });
      } else {
        this.isEdit = false;
        const proj = this.projects()[0]?.id ?? '';
        this.form.reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          projectId: proj,
          assigneeId: '',
        });
      }
    });
  }

  async onSubmit(): Promise<void> {
    const raw = this.form.getRawValue();
    const data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: raw.title,
      description: raw.description ?? '',
      status: raw.status as Task['status'],
      priority: raw.priority as Task['priority'],
      projectId: raw.projectId,
      assigneeId: raw.assigneeId || undefined,
    };
    const id = this.taskId();
    if (this.isEdit && id) {
      await this.taskService.update(id, data);
    } else {
      await this.taskService.create(data);
    }
    this.closed.emit();
  }
}
