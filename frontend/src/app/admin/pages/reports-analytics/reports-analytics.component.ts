import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports-analytics',
  template: `
    <div class="reports-analytics-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Reports & Analytics</h1>
            <p class="page-subtitle">Comprehensive insights and data analysis for marathon management</p>
          </div>
          <div class="header-actions">
            <button class="btn-secondary schedule-btn" (click)="scheduleReport()">
              <mat-icon>schedule</mat-icon>
              Schedule Report
            </button>
            <button class="btn-primary export-btn" (click)="exportReport()">
              <mat-icon>download</mat-icon>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalRevenue() | currency:'TZS':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Total Revenue</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalRegistrations() }}</div>
            <div class="stat-label">Total Registrations</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>analytics</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getConversionRate() }}%</div>
            <div class="stat-label">Conversion Rate</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>assessment</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getAverageRevenue() | currency:'TZS':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Avg. Revenue</div>
          </div>
        </div>
      </div>

      <!-- Report Types Grid -->
      <div class="reports-grid">
        <div class="report-card">
          <div class="report-icon">
            <mat-icon>bar_chart</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Registration Analytics</h3>
            <p class="report-description">Track registration trends, demographics, and growth patterns</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewRegistrationReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadRegistrationReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Financial Reports</h3>
            <p class="report-description">Revenue analysis, payment trends, and financial performance</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewFinancialReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadFinancialReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <mat-icon>category</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Category Analysis</h3>
            <p class="report-description">Breakdown by race categories and participant preferences</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewCategoryReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadCategoryReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <mat-icon>location_on</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Geographic Reports</h3>
            <p class="report-description">Participant distribution and regional performance</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewGeographicReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadGeographicReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Timeline Analysis</h3>
            <p class="report-description">Registration patterns over time and seasonal trends</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewTimelineReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadTimelineReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="report-icon">
            <mat-icon>assessment</mat-icon>
          </div>
          <div class="report-content">
            <h3 class="report-title">Performance Metrics</h3>
            <p class="report-description">KPIs, conversion rates, and overall performance indicators</p>
            <div class="report-actions">
              <button class="btn-secondary" (click)="viewPerformanceReport()">
                <mat-icon>visibility</mat-icon>
                View Report
              </button>
              <button class="btn-primary" (click)="downloadPerformanceReport()">
                <mat-icon>download</mat-icon>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-card">
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
        </div>
        <div class="actions-grid">
          <button class="action-btn" (click)="generateCustomReport()">
            <mat-icon>add_chart</mat-icon>
            <span>Generate Custom Report</span>
          </button>
          <button class="action-btn" (click)="scheduleWeeklyReport()">
            <mat-icon>schedule</mat-icon>
            <span>Schedule Weekly Report</span>
          </button>
          <button class="action-btn" (click)="exportAllReports()">
            <mat-icon>file_download</mat-icon>
            <span>Export All Reports</span>
          </button>
          <button class="action-btn" (click)="shareReport()">
            <mat-icon>share</mat-icon>
            <span>Share Report</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./reports-analytics.component.scss']
})
export class ReportsAnalyticsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Initialize reports data
  }

  getTotalRevenue(): number {
    return 0; // No revenue yet since registration hasn't started
  }

  getTotalRegistrations(): number {
    return 0; // No registrations yet
  }

  getConversionRate(): number {
    return 0; // No conversions yet
  }

  getAverageRevenue(): number {
    return 0; // No revenue yet
  }

  exportReport() {
    console.log('Export report');
  }

  scheduleReport() {
    console.log('Schedule report');
  }

  viewRegistrationReport() {
    console.log('View registration report');
  }

  downloadRegistrationReport() {
    console.log('Download registration report');
  }

  viewFinancialReport() {
    console.log('View financial report');
  }

  downloadFinancialReport() {
    console.log('Download financial report');
  }

  viewCategoryReport() {
    console.log('View category report');
  }

  downloadCategoryReport() {
    console.log('Download category report');
  }

  viewGeographicReport() {
    console.log('View geographic report');
  }

  downloadGeographicReport() {
    console.log('Download geographic report');
  }

  viewTimelineReport() {
    console.log('View timeline report');
  }

  downloadTimelineReport() {
    console.log('Download timeline report');
  }

  viewPerformanceReport() {
    console.log('View performance report');
  }

  downloadPerformanceReport() {
    console.log('Download performance report');
  }

  generateCustomReport() {
    console.log('Generate custom report');
  }

  scheduleWeeklyReport() {
    console.log('Schedule weekly report');
  }

  exportAllReports() {
    console.log('Export all reports');
  }

  shareReport() {
    console.log('Share report');
  }
} 