import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="admin-login-container">
      <!-- Left Side - Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="logo-container">
            <img src="/assets/images/logo/Mwl Marathon logo 01_01.png" alt="Marathon Logo" class="hero-logo">
            <h1 class="hero-title">Mwalimu Nyerere</h1>
            <h2 class="hero-subtitle">International Marathon 2025</h2>
          </div>
          
          <div class="hero-features">
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Complete Race Management</h3>
                <p>Manage registrations, payments, and race logistics</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Real-time Analytics</h3>
                <p>Track performance metrics and generate reports</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <div class="feature-text">
                <h3>Secure Access Control</h3>
                <p>Role-based permissions and secure authentication</p>
              </div>
            </div>
          </div>
          
          <div class="hero-footer">
            <p class="copyright">© 2025 Mwalimu Nyerere Marathon. All rights reserved.</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-section">
        <div class="login-container">
          <div class="login-header">
            <h2 class="login-title">Admin Dashboard</h2>
            <p class="login-subtitle">Sign in to access the marathon management system</p>
          </div>

          <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <input 
                  id="email" 
                  type="email" 
                  formControlName="email"
                  class="form-input"
                  placeholder="Enter your email address"
                  [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                >
              </div>
              <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <input 
                  id="password" 
                  type="password" 
                  formControlName="password"
                  class="form-input"
                  placeholder="Enter your password"
                  [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button 
                  type="button" 
                  class="password-toggle"
                  (click)="togglePasswordVisibility()"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                </button>
              </div>
              <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" class="checkbox-input">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Remember me</span>
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              class="login-button"
              [disabled]="loginForm.invalid || isLoading"
              [class.loading]="isLoading"
            >
              <span class="button-text" *ngIf="!isLoading">Sign In</span>
              <span class="button-text" *ngIf="isLoading">Signing In...</span>
              <div class="spinner" *ngIf="isLoading">
                <div class="spinner-ring"></div>
              </div>
            </button>

            <div class="error-alert" *ngIf="errorMessage">
              <div class="alert-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span>{{ errorMessage }}</span>
            </div>
          </form>

          <!-- Demo Credentials Card -->
          <div class="demo-credentials">
            <div class="demo-header">
              <div class="demo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Demo Access</h3>
            </div>
            <p class="demo-description">Use these credentials to explore the admin dashboard:</p>
            <div class="demo-info">
              <div class="demo-item">
                <span class="demo-label">Email:</span>
                <span class="demo-value">admin@marathon.com</span>
              </div>
              <div class="demo-item">
                <span class="demo-label">Password:</span>
                <span class="demo-value">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Pre-fill with demo credentials
    this.loginForm.patchValue({
      email: 'admin@marathon.com',
      password: 'admin123'
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      // Simulate API call delay
      setTimeout(() => {
        // For demo purposes, check against hardcoded admin credentials
        if (email === 'admin@marathon.com' && password === 'admin123') {
          // Create a mock admin user
          const adminUser = {
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@marathon.com',
            phone: '+255 123 456 789',
            dateOfBirth: '1990-01-01',
            gender: 'male' as const,
            nationality: 'Tanzanian',
            role: 'admin' as const,
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString()
          };

          // Store admin session
          localStorage.setItem('admin_token', 'demo_admin_token');
          localStorage.setItem('admin_user', JSON.stringify(adminUser));
          
          // Navigate to admin dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
          this.router.navigate([returnUrl]);
        } else {
          this.errorMessage = 'Invalid email or password. Please use the demo credentials.';
        }

        this.isLoading = false;
      }, 1500); // 1.5 second delay for realistic feel
    }
  }
} 