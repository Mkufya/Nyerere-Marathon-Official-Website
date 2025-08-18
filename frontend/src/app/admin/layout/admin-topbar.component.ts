import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-admin-topbar',
  template: `
    <header class="admin-topbar">
      <!-- Left Section -->
      <div class="topbar-left">
        <button 
          class="sidebar-toggle-btn"
          (click)="onToggleSidebar()"
          [attr.aria-label]="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
          <mat-icon>menu</mat-icon>
        </button>
        
        <!-- Search Bar -->
        <div class="search-container">
          <mat-icon class="search-icon">search</mat-icon>
          <input 
            type="text" 
            class="search-input"
            placeholder="Search..."
            [formControl]="searchControl">
        </div>
      </div>

      <!-- Right Section -->
      <div class="topbar-right">
        <!-- Theme Toggle -->
        <button 
          class="theme-toggle-btn"
          (click)="onToggleTheme()"
          [attr.aria-label]="'Toggle ' + (isDarkTheme ? 'light' : 'dark') + ' theme'">
          <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- Notifications -->
        <div class="notifications-container">
          <button 
            class="notifications-btn"
            (click)="toggleNotifications()"
            [class.has-notifications]="unreadNotifications > 0">
            <mat-icon>notifications</mat-icon>
            <span class="notification-badge" *ngIf="unreadNotifications > 0">
              {{ unreadNotifications }}
            </span>
          </button>
          
          <!-- Notifications Dropdown -->
          <div class="notifications-dropdown" *ngIf="showNotifications">
            <div class="notifications-header">
              <h3>Notifications</h3>
              <button class="mark-all-read" (click)="markAllAsRead()">
                Mark all as read
              </button>
            </div>
            <div class="notifications-list">
              <div 
                class="notification-item"
                *ngFor="let notification of notifications"
                [class.unread]="!notification.read"
                (click)="markAsRead(notification)">
                <div class="notification-icon">
                  <mat-icon>{{ getNotificationIcon(notification.type) }}</mat-icon>
                </div>
                <div class="notification-content">
                  <div class="notification-message">{{ notification.message }}</div>
                  <div class="notification-time">{{ notification.time }}</div>
                </div>
              </div>
              <div class="no-notifications" *ngIf="notifications.length === 0">
                No notifications
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="user-menu-container">
          <button 
            class="user-menu-btn"
            (click)="toggleUserMenu()">
            <img 
              [src]="currentUser.avatar" 
              [alt]="currentUser.name"
              class="user-avatar">
            <span class="user-name">{{ currentUser.name }}</span>
            <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
          </button>
          
          <!-- User Dropdown -->
          <div class="user-dropdown" *ngIf="showUserMenu">
            <div class="user-info">
              <img 
                [src]="currentUser.avatar" 
                [alt]="currentUser.name"
                class="user-avatar-large">
              <div class="user-details">
                <div class="user-name-large">{{ currentUser.name }}</div>
                <div class="user-email">{{ currentUser.email }}</div>
                <div class="user-role">{{ currentUser.role }}</div>
              </div>
            </div>
            <div class="user-menu-items">
              <a href="#" class="menu-item" (click)="onProfile()">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </a>
              <a href="#" class="menu-item" (click)="onSettings()">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </a>
              <div class="menu-divider"></div>
              <a href="#" class="menu-item logout-item" (click)="onLogout()">
                <mat-icon>logout</mat-icon>
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./admin-topbar.component.scss']
})
export class AdminTopbarComponent {
  @Input() sidebarCollapsed = false;
  @Input() currentUser: any = {};
  @Input() notifications: any[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  searchControl = new FormControl('');
  showNotifications = false;
  showUserMenu = false;
  isDarkTheme = false;

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  constructor() {
    this.setupSearch();
    this.loadThemePreference();
  }

  private setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        // Handle search functionality
        console.log('Search:', value);
      });
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('admin-theme');
    this.isDarkTheme = savedTheme === 'dark';
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.toggleTheme.emit();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(notification: any) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'registration': 'person_add',
      'payment': 'payment',
      'system': 'system_update',
      'default': 'notifications'
    };
    return icons[type] || icons['default'];
  }

  onProfile() {
    // Navigate to profile page
    console.log('Navigate to profile');
  }

  onSettings() {
    // Navigate to settings page
    console.log('Navigate to settings');
  }

  onLogout() {
    // Close the user menu
    this.showUserMenu = false;
    
    // Emit logout event
    this.logout.emit();
  }
} 