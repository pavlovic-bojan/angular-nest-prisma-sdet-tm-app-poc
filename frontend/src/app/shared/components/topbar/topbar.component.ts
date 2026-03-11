import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <button
          (click)="layout.toggleSidebar()"
          data-testid="sidebar-toggle"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
          [attr.aria-label]="layout.isSidebarOpen() ? 'Close sidebar' : 'Open sidebar'"
          title="{{ layout.isSidebarOpen() ? 'Close sidebar' : 'Open sidebar' }}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd"/>
          </svg>
        </button>
        <h1 class="text-xl font-semibold text-slate-800 dark:text-white">{{ title }}</h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          (click)="toggleTheme()"
          data-testid="theme-toggle"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
          title="Theme"
          aria-label="Toggle theme"
        >
          @if (theme.currentTheme() === 'dark') {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          }
        </button>
        <div class="relative" (click)="$event.stopPropagation()">
        @if (auth.user(); as user) {
          <button
            (click)="dropdownOpen.set(!dropdownOpen())"
            data-testid="user-menu-btn"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-expanded="dropdownOpen()"
            aria-haspopup="true"
          >
            <div
              class="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-medium shrink-0"
            >
              {{ getInitials(user.name) }}
            </div>
          </button>

          @if (dropdownOpen()) {
            <div
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50"
            >
              <button
                type="button"
                (click)="openProfile(user.id)"
                data-testid="profile-btn"
                class="w-full px-4 py-3 text-left border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <p class="text-sm font-medium text-slate-800 dark:text-white">{{ user.name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ user.email }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ user.role }}</p>
              </button>
              <div class="py-1">
                <button
                  (click)="logout()"
                  data-testid="logout-btn"
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clip-rule="evenodd"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          }
        }
        </div>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  title = 'Angular Task Manager';
  dropdownOpen = signal(false);
  layout = inject(LayoutService);
  theme = inject(ThemeService);

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click')
  onDocumentClick(): void {
    this.dropdownOpen.set(false);
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  toggleTheme(): void {
    const next = this.theme.currentTheme() === 'dark' ? 'light' : 'dark';
    this.theme.setTheme(next);
  }

  openProfile(id: string): void {
    this.dropdownOpen.set(false);
    this.layout.openProfileDrawer(id);
  }

  logout(): void {
    this.dropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
