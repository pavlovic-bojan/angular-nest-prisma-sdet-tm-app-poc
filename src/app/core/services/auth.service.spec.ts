import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid credentials', () => {
    const result = service.login('demo@example.com', 'password123');
    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.name).toBe('Demo User');
  });

  it('should reject invalid credentials', () => {
    const result = service.login('wrong@email.com', 'wrongpass');
    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should logout and clear user', () => {
    service.login('demo@example.com', 'password123');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });
});
