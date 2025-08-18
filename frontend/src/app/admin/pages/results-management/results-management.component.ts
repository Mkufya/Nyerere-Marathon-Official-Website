import { Component } from '@angular/core';

@Component({
  selector: 'app-results-management',
  template: `
    <div class="results-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Results Management</h1>
            <p class="page-subtitle">Upload race results, manage rankings, and generate certificates</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary upload-btn">
              <mat-icon>cloud_upload</mat-icon>
              Upload Results
            </button>
            <button class="btn-secondary certificate-btn">
              <mat-icon>card_membership</mat-icon>
              Generate Certificates
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>emoji_events</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">0</div>
            <div class="stat-label">Total Results</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">0</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>card_membership</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">0</div>
            <div class="stat-label">Certificates</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>category</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">4</div>
            <div class="stat-label">Categories</div>
          </div>
        </div>
      </div>

      <!-- Content Card -->
      <div class="content-card">
        <div class="card-header">
          <h2 class="card-title">Race Results</h2>
          <div class="card-actions">
            <div class="search-box">
              <mat-icon>search</mat-icon>
              <input type="text" placeholder="Search results..." class="search-input">
            </div>
          </div>
        </div>

        <div class="empty-state">
          <div class="empty-icon">
            <mat-icon>emoji_events</mat-icon>
          </div>
          <h3>No Results Available</h3>
          <p>Upload race results to get started with results management</p>
          <button class="btn-primary">
            <mat-icon>cloud_upload</mat-icon>
            Upload First Results
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./results-management.component.scss']
})
export class ResultsManagementComponent {} 