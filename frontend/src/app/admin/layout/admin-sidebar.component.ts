import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string | null;
  count?: number;
  expanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  template: `
    <aside class="admin-sidebar" [class.collapsed]="collapsed">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo-container">
          <img 
            src="/assets/images/logo/Mwl Marathon logo 01_01.png" 
            alt="Marathon Logo" 
            class="logo"
            [class.logo-small]="collapsed">
          <span class="logo-text" *ngIf="!collapsed">Marathon Admin</span>
        </div>
        <button 
          class="sidebar-toggle"
          (click)="onToggleSidebar()"
          [attr.aria-label]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'">
          <mat-icon>{{ collapsed ? 'menu' : 'menu_open' }}</mat-icon>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li class="nav-item" *ngFor="let menuItem of menuItems">
            <!-- Single Menu Item -->
            <ng-container *ngIf="!menuItem.children">
              <a 
                [routerLink]="menuItem.route" 
                routerLinkActive="active"
                class="nav-link"
                [class.collapsed]="collapsed">
                <mat-icon class="nav-icon">{{ menuItem.icon }}</mat-icon>
                <span class="nav-text" *ngIf="!collapsed">{{ menuItem.label }}</span>
                <span class="nav-count" *ngIf="menuItem.count && !collapsed">{{ menuItem.count }}</span>
              </a>
            </ng-container>

            <!-- Menu Item with Children -->
            <ng-container *ngIf="menuItem.children">
              <div 
                class="nav-link has-children"
                [class.expanded]="menuItem.expanded"
                [class.collapsed]="collapsed"
                (click)="toggleSubmenu(menuItem)">
                <div class="nav-link-content">
                  <mat-icon class="nav-icon">{{ menuItem.icon }}</mat-icon>
                  <span class="nav-text" *ngIf="!collapsed">{{ menuItem.label }}</span>
                  <span class="nav-count" *ngIf="menuItem.count && !collapsed">{{ menuItem.count }}</span>
                </div>
                <mat-icon 
                  class="expand-icon" 
                  *ngIf="!collapsed"
                  [class.rotated]="menuItem.expanded">
                  expand_more
                </mat-icon>
              </div>
              
              <!-- Submenu -->
              <ul class="submenu" [class.expanded]="menuItem.expanded" *ngIf="!collapsed">
                <li class="submenu-item" *ngFor="let child of menuItem.children">
                  <a 
                    [routerLink]="child.route" 
                    routerLinkActive="active"
                    class="submenu-link">
                    <mat-icon class="submenu-icon">{{ child.icon }}</mat-icon>
                    <span class="submenu-text">{{ child.label }}</span>
                  </a>
                </li>
              </ul>
            </ng-container>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="admin-info">
          <img 
            [src]="currentUser.avatar" 
            [alt]="currentUser.name"
            class="admin-avatar">
          <div class="admin-details">
            <div class="admin-name">{{ currentUser.name }}</div>
            <div class="admin-role">{{ currentUser.role }}</div>
          </div>
        </div>
        <button class="sidebar-logout-btn" (click)="onLogout()">
          <mat-icon>logout</mat-icon>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `,
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  currentUser = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: '/assets/images/default-avatar.svg'
  };

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Content',
      icon: 'article',
      route: null,
      expanded: false,
      children: [
        { label: 'News & Media', icon: 'newspaper', route: '/admin/news' },
        { label: 'Gallery', icon: 'photo_library', route: '/admin/media' },
        { label: 'Media Management', icon: 'cloud_upload', route: '/admin/media' },
        { label: 'Announcements', icon: 'campaign', route: '/admin/announcements' }
      ]
    },
    {
      label: 'Participants',
      icon: 'people',
      route: '/admin/participants',
      count: 0
    },
    {
      label: 'Payments',
      icon: 'payment',
      route: '/admin/payments',
      count: 0
    },
    {
      label: 'Race Management',
      icon: 'emoji_events',
      route: null,
      expanded: false,
      children: [
        { label: 'Categories', icon: 'category', route: '/admin/categories' },
        { label: 'Results', icon: 'leaderboard', route: '/admin/results' }
      ]
    },
    {
      label: 'Users',
      icon: 'admin_panel_settings',
      route: '/admin/users',
      count: 1
    },
    {
      label: 'Reports',
      icon: 'analytics',
      route: '/admin/reports'
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/admin/settings'
    }
  ];

  constructor(private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleSubmenu(menuItem: MenuItem) {
    if (this.collapsed) return;
    menuItem.expanded = !menuItem.expanded;
  }

  onLogout() {
    this.logout.emit();
  }
} 