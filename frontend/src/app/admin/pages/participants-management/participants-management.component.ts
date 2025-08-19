import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-participants-management',
  template: `
    <div class="participants-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Participants Management</h1>
            <p class="page-subtitle">Manage all marathon participants and their registrations</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary export-btn" (click)="exportParticipants()">
              <mat-icon>download</mat-icon>
              Export CSV
            </button>
            <button class="btn-primary add-btn" (click)="openAddParticipantDialog()">
              <mat-icon>person_add</mat-icon>
              Add Participant
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
            <div class="stat-value">{{ participants.length }}</div>
            <div class="stat-label">Total Participants</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getPaidParticipants() }}</div>
            <div class="stat-label">Paid</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>pending</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getPendingParticipants() }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>category</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getUniqueCategories() }}</div>
            <div class="stat-label">Categories</div>
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
                  placeholder="Search participants..." 
                  class="search-input">
              </div>
            </div>
            <div class="filter-item">
              <label class="filter-label">Race Category</label>
              <select 
                [(ngModel)]="selectedCategory"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Categories</option>
                <option value="42km">Full Marathon (42km)</option>
                <option value="21km">Half Marathon (21km)</option>
                <option value="10km">10km Race</option>
                <option value="5km">5km Fun Run</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Payment Status</label>
              <select 
                [(ngModel)]="selectedPaymentStatus"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Gender</label>
              <select 
                [(ngModel)]="selectedGender"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Participants Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Participants ({{ dataSource.data.length }})</h3>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort class="data-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
              <td mat-cell *matCellDef="let participant">
                <span class="id-badge">{{ participant.id }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let participant">
                <div class="participant-info">
                  <div class="participant-avatar">
                    <span>{{ participant.name.charAt(0) }}</span>
                  </div>
                  <div class="participant-details">
                    <div class="participant-name">{{ participant.name }}</div>
                    <div class="participant-email">{{ participant.email }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
              <td mat-cell *matCellDef="let participant">
                <span class="category-badge" [class]="getCategoryClass(participant.category)">
                  {{ participant.category }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Gender</th>
              <td mat-cell *matCellDef="let participant">
                <span class="gender-badge" [class]="participant.gender.toLowerCase()">
                  {{ participant.gender }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="age">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Age</th>
              <td mat-cell *matCellDef="let participant">
                <span class="age-badge">{{ participant.age }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="paymentStatus">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Payment</th>
              <td mat-cell *matCellDef="let participant">
                <span class="payment-badge" [class]="getPaymentStatusClass(participant.paymentStatus)">
                  <mat-icon>{{ getPaymentIcon(participant.paymentStatus) }}</mat-icon>
                  {{ participant.paymentStatus }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="registrationDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Registered</th>
              <td mat-cell *matCellDef="let participant">
                <div class="date-info">
                  <div class="date">{{ participant.registrationDate | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ participant.registrationDate | date:'HH:mm' }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let participant">
                <div class="action-buttons">
                  <button class="btn-icon edit" (click)="editParticipant(participant)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="btn-icon view" (click)="viewParticipant(participant)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button class="btn-icon delete" (click)="deleteParticipant(participant)">
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
  styleUrls: ['./participants-management.component.scss']
})
export class ParticipantsManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'name', 'category', 'gender', 'age', 'paymentStatus', 'registrationDate', 'actions'];
  
  searchTerm = '';
  selectedCategory = '';
  selectedPaymentStatus = '';
  selectedGender = '';

  participants: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loadParticipants();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadParticipants() {
    // Since registration hasn't started yet, start with empty data
    this.participants = [];

    this.dataSource.data = this.participants;
  }

  applyFilter() {
    let filteredData = this.participants;

    if (this.searchTerm) {
      filteredData = filteredData.filter(participant =>
        participant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      filteredData = filteredData.filter(participant =>
        participant.category === this.selectedCategory
      );
    }

    if (this.selectedPaymentStatus) {
      filteredData = filteredData.filter(participant =>
        participant.paymentStatus === this.selectedPaymentStatus
      );
    }

    if (this.selectedGender) {
      filteredData = filteredData.filter(participant =>
        participant.gender === this.selectedGender
      );
    }

    this.dataSource.data = filteredData;
  }

  getPaidParticipants(): number {
    return this.participants.filter(p => p.paymentStatus === 'paid').length;
  }

  getPendingParticipants(): number {
    return this.participants.filter(p => p.paymentStatus === 'pending').length;
  }

  getUniqueCategories(): number {
    return new Set(this.participants.map(p => p.category)).size;
  }

  getCategoryClass(category: string): string {
    const classes: { [key: string]: string } = {
      '42km': 'full-marathon',
      '21km': 'half-marathon',
      '10km': 'ten-km',
      '5km': 'five-km'
    };
    return classes[category] || 'default';
  }

  getPaymentStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'paid': 'paid',
      'pending': 'pending',
      'failed': 'failed'
    };
    return classes[status] || 'default';
  }

  getPaymentIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'paid': 'check_circle',
      'pending': 'schedule',
      'failed': 'error'
    };
    return icons[status] || 'payment';
  }

  openAddParticipantDialog() {
    console.log('Open add participant dialog');
  }

  editParticipant(participant: any) {
    console.log('Edit participant:', participant);
  }

  viewParticipant(participant: any) {
    console.log('View participant:', participant);
  }

  deleteParticipant(participant: any) {
    console.log('Delete participant:', participant);
  }

  exportParticipants() {
    console.log('Export participants to CSV');
  }
} 