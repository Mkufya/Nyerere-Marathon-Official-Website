import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <mat-card>
            <mat-card-header>
              <mat-card-title class="text-center w-100">
                <mat-icon class="login-icon">account_circle</mat-icon>
                <h2>Login</h2>
              </mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" placeholder="Enter your email">
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                    Email is required
                  </mat-error>
                  <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                    Please enter a valid email
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" 
                         formControlName="password" placeholder="Enter your password">
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" 
                          type="button" [attr.aria-label]="'Hide password'" 
                          [attr.aria-pressed]="hidePassword">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                    Password is required
                  </mat-error>
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" 
                        class="w-100 mb-3" [disabled]="loginForm.invalid || loading">
                  <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                  <span *ngIf="!loading">Login</span>
                </button>

                <!-- Test button for debugging -->
                <button mat-stroked-button color="accent" type="button" 
                        class="w-100 mb-3" (click)="testBackendConnection()">
                  Test Backend Connection
                </button>
              </form>
            </mat-card-content>
            
            <mat-card-actions class="text-center">
              <p>Don't have an account? 
                <a routerLink="/register" class="text-primary">Register here</a>
              </p>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-icon {
      font-size: 3rem;
      color: #1976d2;
      margin-bottom: 16px;
    }
    
    mat-card {
      padding: 20px;
    }
    
    .w-100 {
      width: 100%;
    }
    
    .mb-3 {
      margin-bottom: 1rem;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-primary {
      color: #1976d2;
      text-decoration: none;
    }
    
    .text-primary:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Redirect based on role if already logged in
    if (this.authService.isAuthenticated()) {
      if (this.returnUrl === '/dashboard') {
          this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate([this.returnUrl]);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      console.log('🔍 Login attempt for email:', email);
      console.log('🌐 API URL:', environment.apiUrl);
      
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('✅ Login successful:', response);
          this.loading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          
          // Navigate based on user role, unless a specific return URL was requested
          if (this.returnUrl === '/dashboard') {
              this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          console.error('❌ Login failed:', error);
          console.error('❌ Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.loading = false;
          const message = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    } else {
      console.log('❌ Login form is invalid:', this.loginForm.errors);
      console.log('❌ Form values:', this.loginForm.value);
      console.log('❌ Form status:', this.loginForm.status);
      
      // Show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          console.log(`❌ ${key} errors:`, control.errors);
        }
      });
    }
  }

  testBackendConnection(): void {
    console.log('🧪 Testing backend connection from login...');
    console.log('🌐 API URL:', environment.apiUrl);
    
    // Test a simple GET request to see if the backend is reachable
    this.http.get(`${environment.apiUrl}/test`).subscribe({
      next: (response) => {
        console.log('✅ Backend connection successful:', response);
        this.snackBar.open('Backend connection successful!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Backend connection failed:', error);
        this.snackBar.open(`Backend connection failed: ${error.status} ${error.statusText}`, 'Close', { duration: 5000 });
      }
    });
  }
} 