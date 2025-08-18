import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout" [class.sidebar-collapsed]="sidebarCollapsed" [class.dark-theme]="isDarkTheme">
      <!-- Sidebar -->
      <app-admin-sidebar 
        [collapsed]="sidebarCollapsed"
        (toggleSidebar)="toggleSidebar()"
        (logout)="logout()">
      </app-admin-sidebar>
      
      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Topbar -->
        <app-admin-topbar 
          [sidebarCollapsed]="sidebarCollapsed"
          [currentUser]="currentUser"
          [notifications]="notifications"
          (toggleSidebar)="toggleSidebar()"
          (toggleTheme)="toggleTheme()"
          (logout)="logout()">
        </app-admin-topbar>
        
        <!-- Breadcrumbs -->
        <div class="breadcrumb-container" *ngIf="breadcrumbs.length > 0">
          <nav class="breadcrumb-nav">
            <ol class="breadcrumb-list">
              <li class="breadcrumb-item" *ngFor="let breadcrumb of breadcrumbs; let last = last">
                <a 
                  *ngIf="!last && breadcrumb.url" 
                  [routerLink]="breadcrumb.url" 
                  class="breadcrumb-link">
                  {{ breadcrumb.label }}
                </a>
                <span *ngIf="last" class="breadcrumb-current">
                  {{ breadcrumb.label }}
                </span>
              </li>
            </ol>
          </nav>
        </div>
        
        <!-- Page Content -->
        <main class="page-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  isDarkTheme = false;
  currentUser: any = {
    name: 'Admin User',
    email: 'admin@marathon.com',
    avatar: '/assets/images/default-avatar.svg',
    role: 'admin'
  };
  notifications: any[] = [
    { id: 1, message: 'Welcome to the Marathon Admin Dashboard!', time: 'Just now', read: false, type: 'system' },
    { id: 2, message: 'No registrations yet. Start promoting the marathon!', time: 'Just now', read: false, type: 'announcement' },
    { id: 3, message: 'Dashboard is ready for your marathon management', time: 'Just now', read: true, type: 'system' }
  ];
  breadcrumbs: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setupBreadcrumbs();
    this.loadThemePreference();
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    // Load admin user from localStorage
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      try {
        const user = JSON.parse(adminUser);
        this.currentUser = {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          avatar: '/assets/images/default-avatar.svg',
          role: user.role || 'admin'
        };
      } catch (error) {
        console.error('Error parsing admin user:', error);
      }
    }
  }

  private setupBreadcrumbs() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs() {
    const url = this.router.url;
    const segments = url.split('/').filter(segment => segment);
    
    this.breadcrumbs = [
      { label: 'Dashboard', url: '/admin/dashboard' }
    ];

    if (segments.length > 2) {
      const currentPage = segments[2];
      const pageLabels: { [key: string]: string } = {
        'dashboard': 'Dashboard',
        'users': 'Users',
        'media': 'Media',
        'reports': 'Reports',
        'settings': 'Settings',
        'participants': 'Participants',
        'payments': 'Payments',
        'categories': 'Race Categories',
        'results': 'Results',
        'announcements': 'Announcements',
        'cms': 'Content Management',
        'volunteers': 'Volunteers'
      };

      if (pageLabels[currentPage]) {
        this.breadcrumbs.push({
          label: pageLabels[currentPage],
          url: null
        });
      }
    }
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('admin-theme');
    this.isDarkTheme = savedTheme === 'dark';
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('admin-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to sign out?')) {
      // Clear admin session
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Also clear any regular user session
      this.authService.logout();
      
      // Show success message
      alert('You have been successfully signed out.');
      
      // Navigate to admin login
      this.router.navigate(['/admin-login']);
    }
  }
} 