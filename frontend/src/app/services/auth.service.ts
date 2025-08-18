import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  role: 'participant' | 'volunteer' | 'organizer' | 'admin';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    bloodType: string;
  };
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  nationality: string;
  role?: 'participant' | 'volunteer' | 'organizer' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.loadCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  register(userData: RegisterData): Observable<LoginResponse> {
    console.log('📤 AuthService: Sending registration request to:', `${this.apiUrl}/auth/register`);
    console.log('📤 AuthService: Registration data:', userData);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap({
          next: (response) => {
            console.log('✅ AuthService: Registration response received:', response);
            this.setToken(response.token);
            this.currentUserSubject.next(response.user);
          },
          error: (error) => {
            console.error('❌ AuthService: Registration error:', error);
            console.error('❌ AuthService: Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              url: error.url,
              error: error.error
            });
          }
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    console.log('📤 AuthService: Sending login request to:', `${this.apiUrl}/auth/login`);
    console.log('📤 AuthService: Login credentials:', { email, password: '***' });
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap({
          next: (response) => {
            console.log('✅ AuthService: Login response received:', response);
            this.setToken(response.token);
            this.currentUserSubject.next(response.user);
          },
          error: (error) => {
            console.error('❌ AuthService: Login error:', error);
            console.error('❌ AuthService: Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.message,
              url: error.url,
              error: error.error
            });
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  sendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/send-verification`, { email });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, { token });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`);
  }

  private loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile`, userData)
      .pipe(
        tap((response: any) => {
          this.currentUserSubject.next(response.user);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    console.log('🔐 AuthService: Setting token in localStorage');
    localStorage.setItem('auth_token', token);
    console.log('🔐 AuthService: Token stored successfully');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const adminToken = localStorage.getItem('admin_token');
    
    console.log('🔐 AuthService: Checking authentication...');
    console.log('🔐 AuthService: auth_token:', token ? 'exists' : 'not found');
    console.log('🔐 AuthService: admin_token:', adminToken ? 'exists' : 'not found');
    
    const isAuth = (token !== null && !this.isTokenExpired(token)) || adminToken !== null;
    console.log('🔐 AuthService: isAuthenticated result:', isAuth);
    
    return isAuth;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (user) {
      return user.role === role;
    }
    
    // Check for admin session in localStorage
    if (role === 'admin') {
      const adminToken = localStorage.getItem('admin_token');
      const adminUser = localStorage.getItem('admin_user');
      return !!(adminToken && adminUser);
    }
    
    return false;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
} 