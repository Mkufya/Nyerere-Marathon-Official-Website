import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslationService } from '../../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  currentUser: any;
  mobileMenuOpen = false;
  currentLanguage = 'en';
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    // Check if user is logged in and get current user
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // Subscribe to user changes
    this.subscription.add(
      this.authService.currentUser$.subscribe(
        (user: any) => {
          this.currentUser = user;
          this.userName = user?.firstName || user?.name || '';
          this.isLoggedIn = !!user;
        },
        (error: any) => {
          console.error('Error getting current user:', error);
          this.currentUser = null;
          this.userName = '';
          this.isLoggedIn = false;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  switchLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translationService.setLanguage(lang);
  }

  getTranslation(key: string): string {
    return this.translationService.getTranslation(key);
  }
} 