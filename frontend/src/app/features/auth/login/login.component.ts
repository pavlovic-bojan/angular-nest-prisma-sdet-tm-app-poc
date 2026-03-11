import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 sm:px-6">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-6" data-testid="login-heading">Login</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4" data-testid="login-form">
          @if (errorMessage) {
            <div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm" data-testid="login-error">
              {{ errorMessage }}
            </div>
          }
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              formControlName="email"
              data-testid="login-email"
              class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="demo@example.com"
            />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="text-red-500 text-xs mt-1">Email is required</p>
            }
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              formControlName="password"
              data-testid="login-password"
              class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="password123"
            />
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <p class="text-red-500 text-xs mt-1">Password is required</p>
            }
          </div>
          <button
            type="submit"
            [disabled]="form.invalid"
            data-testid="login-submit"
            class="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Login
          </button>
        </form>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Demo: demo&#64;example.com / password123
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  errorMessage = '';
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    const { email, password } = this.form.getRawValue();
    const ok = await this.auth.login(email, password);
    if (ok) {
      this.router.navigate(['/tasks']);
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}
