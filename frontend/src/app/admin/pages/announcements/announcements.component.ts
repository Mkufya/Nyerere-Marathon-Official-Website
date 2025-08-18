import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-announcements',
  template: `
    <div class="announcements-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Announcements</h1>
            <p class="page-subtitle">Send announcements and manage communications with participants</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary template-btn" (click)="manageTemplates()">
              <mat-icon>description</mat-icon>
              Templates
            </button>
            <button class="btn-primary new-btn" (click)="createAnnouncement()">
              <mat-icon>add</mat-icon>
              New Announcement
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>campaign</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ announcements.length }}</div>
            <div class="stat-label">Total Announcements</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>send</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getSentAnnouncements() }}</div>
            <div class="stat-label">Sent</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getScheduledAnnouncements() }}</div>
            <div class="stat-label">Scheduled</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalRecipients() }}</div>
            <div class="stat-label">Recipients</div>
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
                  placeholder="Search announcements..." 
                  class="search-input">
              </div>
            </div>
            <div class="filter-item">
              <label class="filter-label">Status</label>
              <select 
                [(ngModel)]="selectedStatus"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Type</label>
              <select 
                [(ngModel)]="selectedType"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Date Range</label>
              <select 
                [(ngModel)]="selectedDateRange"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Announcements Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Announcements ({{ dataSource.data.length }})</h3>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort class="data-table">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
              <td mat-cell *matCellDef="let announcement">
                <div class="announcement-info">
                  <div class="announcement-title">{{ announcement.title }}</div>
                  <div class="announcement-preview">{{ announcement.preview }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
              <td mat-cell *matCellDef="let announcement">
                <span class="type-badge" [class]="announcement.type">
                  <mat-icon>{{ getTypeIcon(announcement.type) }}</mat-icon>
                  {{ announcement.type | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let announcement">
                <span class="status-badge" [class]="announcement.status">
                  <mat-icon>{{ getStatusIcon(announcement.status) }}</mat-icon>
                  {{ announcement.status | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="recipients">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Recipients</th>
              <td mat-cell *matCellDef="let announcement">
                <span class="recipients-badge">{{ announcement.recipients }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let announcement">
                <div class="date-info">
                  <div class="date">{{ announcement.date | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ announcement.date | date:'HH:mm' }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let announcement">
                <div class="action-buttons">
                  <button class="btn-icon view" (click)="viewAnnouncement(announcement)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button class="btn-icon edit" (click)="editAnnouncement(announcement)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="btn-icon duplicate" (click)="duplicateAnnouncement(announcement)">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                  <button class="btn-icon delete" (click)="deleteAnnouncement(announcement)">
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
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['title', 'type', 'status', 'recipients', 'date', 'actions'];
  
  searchTerm = '';
  selectedStatus = '';
  selectedType = '';
  selectedDateRange = '';

  announcements: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadAnnouncements();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAnnouncements() {
    // Since no announcements have been created yet, start with empty data
    this.announcements = [];

    this.dataSource.data = this.announcements;
  }

  applyFilter() {
    let filteredData = this.announcements;

    if (this.searchTerm) {
      filteredData = filteredData.filter(announcement =>
        announcement.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        announcement.preview.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      filteredData = filteredData.filter(announcement =>
        announcement.status === this.selectedStatus
      );
    }

    if (this.selectedType) {
      filteredData = filteredData.filter(announcement =>
        announcement.type === this.selectedType
      );
    }

    this.dataSource.data = filteredData;
  }

  getSentAnnouncements(): number {
    return this.announcements.filter(a => a.status === 'sent').length;
  }

  getScheduledAnnouncements(): number {
    return this.announcements.filter(a => a.status === 'scheduled').length;
  }

  getTotalRecipients(): number {
    return this.announcements.reduce((sum, a) => sum + a.recipients, 0);
  }

  getTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'email': 'email',
      'sms': 'sms',
      'push': 'notifications'
    };
    return icons[type] || 'campaign';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'sent': 'check_circle',
      'scheduled': 'schedule',
      'draft': 'edit'
    };
    return icons[status] || 'help';
  }

  createAnnouncement() {
    console.log('Create new announcement');
  }

  manageTemplates() {
    console.log('Manage templates');
  }

  viewAnnouncement(announcement: any) {
    console.log('View announcement:', announcement);
  }

  editAnnouncement(announcement: any) {
    console.log('Edit announcement:', announcement);
  }

  duplicateAnnouncement(announcement: any) {
    console.log('Duplicate announcement:', announcement);
  }

  deleteAnnouncement(announcement: any) {
    console.log('Delete announcement:', announcement);
  }
} 