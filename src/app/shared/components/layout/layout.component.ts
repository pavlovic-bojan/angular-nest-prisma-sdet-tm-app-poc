import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';
import { UserFormComponent } from '../../../features/users/user-form/user-form.component';
import { DrawerComponent } from '../drawer/drawer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, DrawerComponent, UserFormComponent],
  template: `
    <div class="flex min-h-screen overflow-x-hidden">
      @if (layout.isSidebarOpen()) {
        <app-sidebar />
      }
      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar />
        <main class="flex-1 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 overflow-auto text-slate-900 dark:text-slate-100">
          <router-outlet />
        </main>
      </div>
      <app-drawer
        [open]="layout.isProfileDrawerOpen()"
        [title]="'Edit profile'"
        (close)="layout.closeProfileDrawer()"
      >
        <app-user-form
          [userId]="layout.currentProfileUserId()"
          (closed)="layout.closeProfileDrawer()"
        />
      </app-drawer>
    </div>
  `,
})
export class LayoutComponent {
  layout = inject(LayoutService);
}
