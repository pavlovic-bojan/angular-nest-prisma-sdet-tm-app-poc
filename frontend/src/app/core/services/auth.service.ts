import { Injectable, inject, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  async login(email: string, password: string): Promise<boolean> {
    try {
      const user = await firstValueFrom(
        this.api.post<User>('/auth/login', { email, password })
      );
      this.currentUser.set(user);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    this.currentUser.set(null);
  }

  setUser(user: User | null): void {
    this.currentUser.set(user);
  }
}
