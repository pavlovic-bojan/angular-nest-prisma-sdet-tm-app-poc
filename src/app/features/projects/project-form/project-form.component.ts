import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
        <input
          type="text"
          formControlName="name"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
        />
        @if (form.get('name')?.invalid && form.get('name')?.touched) {
          <p class="text-red-500 text-xs mt-1">Name is required</p>
        }
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea
          formControlName="description"
          rows="3"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
        ></textarea>
      </div>
      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          [disabled]="form.invalid"
          class="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button
          type="button"
          (click)="closed.emit()"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"
        >
          Cancel
        </button>
      </div>
    </form>
  `,
})
export class ProjectFormComponent {
  projectId = input<string | null>(null);

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  isEdit = false;
  closed = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.isEdit = true;
        const project = this.projectService.getById(id);
        if (project) {
          this.form.patchValue({
            name: project.name,
            description: project.description,
          });
        }
      } else {
        this.isEdit = false;
        this.form.reset({ name: '', description: '' });
      }
    });
  }

  onSubmit(): void {
    const { name, description } = this.form.getRawValue();
    const id = this.projectId();
    if (this.isEdit && id) {
      this.projectService.update(id, { name, description });
    } else {
      this.projectService.create({ name, description });
    }
    this.closed.emit();
  }
}
