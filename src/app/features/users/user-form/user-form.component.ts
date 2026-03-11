import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-form',
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
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
        <input
          type="email"
          formControlName="email"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
        />
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <p class="text-red-500 text-xs mt-1">Valid email is required</p>
        }
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
        <input
          type="text"
          formControlName="role"
          class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500"
          placeholder="admin, developer, etc."
        />
        @if (form.get('role')?.invalid && form.get('role')?.touched) {
          <p class="text-red-500 text-xs mt-1">Role is required</p>
        }
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
export class UserFormComponent {
  userId = input<string | null>(null);

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private auth = inject(AuthService);

  isEdit = false;
  closed = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const id = this.userId();
      if (id) {
        this.isEdit = true;
        const user = this.userService.getById(id);
        if (user) {
          this.form.patchValue({
            name: user.name,
            email: user.email,
            role: user.role,
          });
        }
      } else {
        this.isEdit = false;
        this.form.reset({ name: '', email: '', role: '' });
      }
    });
  }

  onSubmit(): void {
    const { name, email, role } = this.form.getRawValue();
    const id = this.userId();
    if (this.isEdit && id) {
      const updated = this.userService.update(id, { name, email, role });
      const current = this.auth.user();
      if (updated && current && current.id === id) {
        this.auth.setUser(updated);
      }
    } else {
      this.userService.create({ name, email, role });
    }
    this.closed.emit();
  }
}
