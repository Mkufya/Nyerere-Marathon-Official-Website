import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-user-management',
  template: `
    <div class="user-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">Manage admin users, roles, and permissions</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary audit-btn" (click)="viewAuditLogs()">
              <mat-icon>security</mat-icon>
              Audit Logs
            </button>
            <button class="btn-primary add-btn" (click)="openAddUserDialog()">
              <mat-icon>person_add</mat-icon>
              Add User
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ users.length }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>admin_panel_settings</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getActiveUsers() }}</div>
            <div class="stat-label">Active Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>security</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getAdminUsers() }}</div>
            <div class="stat-label">Admin Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>verified_user</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getVerifiedUsers() }}</div>
            <div class="stat-label">Verified</div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-card">
        <div class="filters-header">
          <h3 class="filters-title">Filters & Search</h3>
        </div>
        <div class="filters-content">
          <div class="filter-grid">
            <div class="filter-item">
              <label class="filter-label">Search</label>
              <div class="search-box">
                <mat-icon>search</mat-icon>
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm"
                  (input)="applyFilter()"
                  placeholder="Search users..." 
                  class="search-input">
              </div>
            </div>
            <div class="filter-item">
              <label class="filter-label">Role</label>
              <select 
                [(ngModel)]="selectedRole"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="manager">Manager</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Status</label>
              <select 
                [(ngModel)]="selectedStatus"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Verification</label>
              <select 
                [(ngModel)]="selectedVerification"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Admin Users ({{ dataSource.data.length }})</h3>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort class="data-table">
            <ng-container matColumnDef="avatar">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let user">
                <div class="user-info">
                  <div class="user-avatar">
                    <img [src]="user.avatar" [alt]="user.name" *ngIf="user.avatar">
                    <span *ngIf="!user.avatar">{{ user.name.charAt(0) }}</span>
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
              <td mat-cell *matCellDef="let user">
                <span class="role-badge" [class]="user.role">
                  <mat-icon>{{ getRoleIcon(user.role) }}</mat-icon>
                  {{ user.role | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let user">
                <span class="status-badge" [class]="user.status">
                  <mat-icon>{{ getStatusIcon(user.status) }}</mat-icon>
                  {{ user.status | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="verification">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Verification</th>
              <td mat-cell *matCellDef="let user">
                <span class="verification-badge" [class]="user.verified ? 'verified' : 'unverified'">
                  <mat-icon>{{ user.verified ? 'verified' : 'unpublished' }}</mat-icon>
                  {{ user.verified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="lastLogin">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Login</th>
              <td mat-cell *matCellDef="let user">
                <div class="date-info">
                  <div class="date">{{ user.lastLogin | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ user.lastLogin | date:'HH:mm' }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <div class="action-buttons">
                  <button class="btn-icon view" (click)="viewUser(user)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button class="btn-icon edit" (click)="editUser(user)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="btn-icon permissions" (click)="managePermissions(user)">
                    <mat-icon>security</mat-icon>
                  </button>
                  <button 
                    class="btn-icon delete" 
                    (click)="deleteUser(user)"
                    [disabled]="user.role === 'admin'">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['avatar', 'role', 'status', 'verification', 'lastLogin', 'actions'];
  
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  selectedVerification = '';

  users: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    // Since registration hasn't started yet, only show the admin user
    this.users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@marathon.com',
        avatar: '/assets/images/default-avatar.svg',
        role: 'admin',
        status: 'active',
        verified: true,
        lastLogin: new Date('2024-01-20T10:30:00')
      }
    ];

    this.dataSource.data = this.users;
  }

  applyFilter() {
    let filteredData = this.users;

    if (this.searchTerm) {
      filteredData = filteredData.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedRole) {
      filteredData = filteredData.filter(user =>
        user.role === this.selectedRole
      );
    }

    if (this.selectedStatus) {
      filteredData = filteredData.filter(user =>
        user.status === this.selectedStatus
      );
    }

    if (this.selectedVerification) {
      filteredData = filteredData.filter(user =>
        (this.selectedVerification === 'verified' && user.verified) ||
        (this.selectedVerification === 'unverified' && !user.verified)
      );
    }

    this.dataSource.data = filteredData;
  }

  getActiveUsers(): number {
    return this.users.filter(u => u.status === 'active').length;
  }

  getAdminUsers(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  getVerifiedUsers(): number {
    return this.users.filter(u => u.verified).length;
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'admin': 'admin_panel_settings',
      'manager': 'manage_accounts',
      'editor': 'edit',
      'viewer': 'visibility'
    };
    return icons[role] || 'person';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'active': 'check_circle',
      'inactive': 'pause_circle',
      'suspended': 'block'
    };
    return icons[status] || 'help';
  }

  openAddUserDialog() {
    console.log('Open add user dialog');
  }

  viewAuditLogs() {
    console.log('View audit logs');
  }

  viewUser(user: any) {
    console.log('View user:', user);
  }

  editUser(user: any) {
    console.log('Edit user:', user);
  }

  managePermissions(user: any) {
    console.log('Manage permissions for:', user);
  }

  deleteUser(user: any) {
    console.log('Delete user:', user);
  }
} 