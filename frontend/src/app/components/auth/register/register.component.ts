import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, RegisterData } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  loading = false;
  
  // Debug properties
  apiUrl = environment.apiUrl;
  isAuthenticated = false;
  token: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Clear any stale authentication data to ensure users can register
    this.clearStaleAuth();
    
    // Only redirect if user is actually authenticated (has valid token and user data)
    if (this.authService.isUserAuthenticated()) {
        this.router.navigate(['/dashboard']);
    }
    
    this.refreshDebugInfo();
  }

  clearStaleAuth(): void {
    // Clear any stale tokens that might be causing issues
    const token = this.authService.getToken();
    if (token && this.authService.isTokenExpired(token)) {
      console.log('🧹 Clearing expired token...');
      this.authService.logout();
    }
  }

  clearAllAuth(): void {
    console.log('🧹 Clearing all authentication data...');
    this.authService.logout();
    this.refreshDebugInfo();
    this.snackBar.open('All authentication data cleared!', 'Close', { duration: 3000 });
  }

  refreshDebugInfo(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.token = this.authService.getToken();
    console.log('🔍 Debug info refreshed:', {
      isAuthenticated: this.isAuthenticated,
      token: this.token ? 'exists' : 'not found',
      apiUrl: this.apiUrl
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formData = this.registerForm.value;
      
      console.log('🔍 Registration attempt with data:', formData);
      console.log('🌐 API URL:', environment.apiUrl);
      
      // Convert date to ISO string and set role to participant
      const registerData: RegisterData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth instanceof Date 
          ? formData.dateOfBirth.toISOString().split('T')[0] // Format as YYYY-MM-DD
          : formData.dateOfBirth,
        role: 'participant'  // Always set role to participant for public registration
      };
      
      console.log('📤 Sending registration request to backend...');
      console.log('📤 Registration data:', registerData);
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.loading = false;
          this.snackBar.open('Registration successful! Welcome to Nyerere Marathon!', 'Close', { duration: 3000 });
          
          // Refresh debug info after successful registration
          this.refreshDebugInfo();
          
          // Navigate based on user role
          console.log('🔄 Navigating to dashboard...');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          console.error('❌ Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.loading = false;
          const message = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    } else {
      console.log('❌ Registration form is invalid:', this.registerForm.errors);
      console.log('❌ Form values:', this.registerForm.value);
      console.log('❌ Form status:', this.registerForm.status);
      
      // Show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          console.log(`❌ ${key} errors:`, control.errors);
        }
      });
    }
  }

  testBackendConnection(): void {
    console.log('🧪 Testing backend connection...');
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

  testSimpleRequest(): void {
    console.log('🧪 Testing simple HTTP request...');
    
    // Test with a simple POST request
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+255123456789',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      nationality: 'Tanzania',
      role: 'participant'
    };
    
    this.http.post(`${environment.apiUrl}/auth/register`, testData).subscribe({
      next: (response) => {
        console.log('✅ Simple request successful:', response);
        this.snackBar.open('Simple request successful!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('❌ Simple request failed:', error);
        this.snackBar.open(`Simple request failed: ${error.status} ${error.statusText}`, 'Close', { duration: 5000 });
      }
    });
  }
} 