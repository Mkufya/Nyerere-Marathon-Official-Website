import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  loading = false;
  verificationStatus: 'pending' | 'success' | 'error' = 'pending';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.verifyEmail(token);
    } else {
      this.verificationStatus = 'error';
      this.message = 'Invalid verification link';
    }
  }

  verifyEmail(token: string): void {
    this.loading = true;
    
    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading = false;
        this.verificationStatus = 'success';
        this.message = response.message || 'Email verified successfully!';
        this.snackBar.open('Email verified successfully!', 'Close', { duration: 5000 });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.verificationStatus = 'error';
        this.message = error.error?.message || 'Email verification failed';
        this.snackBar.open(this.message, 'Close', { duration: 5000 });
      }
    });
  }

  resendVerification(): void {
    // This would require the user's email - for now, redirect to a resend page
    this.router.navigate(['/resend-verification']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 