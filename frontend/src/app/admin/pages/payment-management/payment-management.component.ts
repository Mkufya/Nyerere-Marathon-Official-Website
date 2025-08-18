import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-payment-management',
  template: `
    <div class="payment-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Payment Management</h1>
            <p class="page-subtitle">Manage all payment transactions and financial operations</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary export-btn" (click)="exportTransactions()">
              <mat-icon>download</mat-icon>
              Export Transactions
            </button>
            <button class="btn-primary refund-btn" (click)="processRefunds()">
              <mat-icon>money_off</mat-icon>
              Process Refunds
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ transactions.length }}</div>
            <div class="stat-label">Total Transactions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">TZS {{ getTotalRevenue() | number:'1.0-0' }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>pending</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getPendingTransactions() }}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getSuccessfulTransactions() }}</div>
            <div class="stat-label">Successful</div>
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
                  placeholder="Search transactions..." 
                  class="search-input">
              </div>
            </div>
            <div class="filter-item">
              <label class="filter-label">Payment Status</label>
              <select 
                [(ngModel)]="selectedStatus"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div class="filter-item">
              <label class="filter-label">Payment Method</label>
              <select 
                [(ngModel)]="selectedMethod"
                (change)="applyFilter()"
                class="filter-select">
                <option value="">All Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Credit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
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
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Payment Transactions ({{ dataSource.data.length }})</h3>
        </div>
        
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort class="data-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Transaction ID</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="transaction-id">{{ transaction.id }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="participant">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Participant</th>
              <td mat-cell *matCellDef="let transaction">
                <div class="participant-info">
                  <div class="participant-avatar">
                    <span>{{ transaction.participantName.charAt(0) }}</span>
                  </div>
                  <div class="participant-details">
                    <div class="participant-name">{{ transaction.participantName }}</div>
                    <div class="participant-email">{{ transaction.participantEmail }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="amount-badge">
                  TZS {{ transaction.amount | number:'1.0-0' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="method">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Method</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="method-badge" [class]="transaction.method">
                  <mat-icon>{{ getMethodIcon(transaction.method) }}</mat-icon>
                  {{ transaction.method | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let transaction">
                <span class="status-badge" [class]="transaction.status">
                  <mat-icon>{{ getStatusIcon(transaction.status) }}</mat-icon>
                  {{ transaction.status | titlecase }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let transaction">
                <div class="date-info">
                  <div class="date">{{ transaction.date | date:'MMM dd, yyyy' }}</div>
                  <div class="time">{{ transaction.date | date:'HH:mm' }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let transaction">
                <div class="action-buttons">
                  <button class="btn-icon view" (click)="viewTransaction(transaction)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button class="btn-icon download" (click)="downloadInvoice(transaction)">
                    <mat-icon>receipt</mat-icon>
                  </button>
                  <button 
                    class="btn-icon refund" 
                    (click)="refundTransaction(transaction)"
                    [disabled]="transaction.status !== 'completed'">
                    <mat-icon>money_off</mat-icon>
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
  styleUrls: ['./payment-management.component.scss']
})
export class PaymentManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'participant', 'amount', 'method', 'status', 'date', 'actions'];
  
  searchTerm = '';
  selectedStatus = '';
  selectedMethod = '';
  selectedDateRange = '';

  transactions: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTransactions() {
    // Since registration hasn't started yet, start with empty data
    this.transactions = [];

    this.dataSource.data = this.transactions;
  }

  applyFilter() {
    let filteredData = this.transactions;

    if (this.searchTerm) {
      filteredData = filteredData.filter(transaction =>
        transaction.participantName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.participantEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      filteredData = filteredData.filter(transaction =>
        transaction.status === this.selectedStatus
      );
    }

    if (this.selectedMethod) {
      filteredData = filteredData.filter(transaction =>
        transaction.method === this.selectedMethod
      );
    }

    this.dataSource.data = filteredData;
  }

  getTotalRevenue(): number {
    return this.transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getPendingTransactions(): number {
    return this.transactions.filter(t => t.status === 'pending').length;
  }

  getSuccessfulTransactions(): number {
    return this.transactions.filter(t => t.status === 'completed').length;
  }

  getMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      'mpesa': 'phone_android',
      'card': 'credit_card',
      'bank': 'account_balance',
      'cash': 'money'
    };
    return icons[method] || 'payment';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'completed': 'check_circle',
      'pending': 'schedule',
      'failed': 'error',
      'refunded': 'money_off'
    };
    return icons[status] || 'help';
  }

  exportTransactions() {
    console.log('Export transactions to CSV');
  }

  processRefunds() {
    console.log('Process refunds');
  }

  viewTransaction(transaction: any) {
    console.log('View transaction:', transaction);
  }

  downloadInvoice(transaction: any) {
    console.log('Download invoice for:', transaction.id);
  }

  refundTransaction(transaction: any) {
    console.log('Refund transaction:', transaction.id);
  }
} 