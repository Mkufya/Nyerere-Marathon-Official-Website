import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminService, DashboardStats, ChartData, ActivityItem, GlanceItem } from '../../../services/admin.service';

@Component({
  selector: 'app-dashboard-overview',
  template: `
    <div class="dashboard-overview">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1 class="welcome-title">Welcome to Marathon Admin</h1>
        <p class="welcome-subtitle">Your marathon dashboard is ready! Start promoting and managing registrations.</p>
        <div class="welcome-actions">
          <button class="action-btn primary">
            <mat-icon>campaign</mat-icon>
            Start Promoting
          </button>
          <button class="action-btn secondary">
            <mat-icon>settings</mat-icon>
            Configure Settings
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of kpiData" [class.empty-state]="kpi.value === 0">
          <div class="kpi-icon" [style.background-color]="kpi.color">
            <mat-icon>{{ kpi.icon }}</mat-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value" [class.zero-value]="kpi.value === 0">
              {{ kpi.value === 0 ? 'No data' : (kpi.value | number) }}
            </div>
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-change" 
                 [class.positive]="kpi.change > 0" 
                 [class.negative]="kpi.change < 0"
                 [class.zero]="kpi.change === 0">
              <mat-icon *ngIf="kpi.change !== 0">{{ kpi.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              <span *ngIf="kpi.change === 0">No change</span>
              <span *ngIf="kpi.change !== 0">{{ kpi.change | abs }}% from last month</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Left Column -->
        <div class="dashboard-left">
          <!-- Charts Section -->
          <div class="chart-section">
            <div class="section-header">
              <h2>Registration Trends</h2>
              <div class="chart-controls">
                <button 
                  *ngFor="let period of chartPeriods" 
                  [class.active]="selectedPeriod === period.value"
                  (click)="selectPeriod(period.value)"
                  class="period-btn">
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="chart-container">
              <canvas baseChart
                [data]="lineChartData"
                [options]="lineChartOptions"
                [type]="'line'">
              </canvas>
            </div>
          </div>

          <!-- Category Distribution -->
          <div class="chart-section">
            <div class="section-header">
              <h2>Participants by Category</h2>
            </div>
            <div class="chart-container">
              <canvas baseChart
                [data]="pieChartData"
                [options]="pieChartOptions"
                [type]="'pie'">
              </canvas>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="dashboard-right">
          <!-- At a Glance Widget -->
          <div class="widget at-a-glance">
            <div class="widget-header">
              <h3>At a Glance</h3>
            </div>
            <div class="widget-content">
              <div class="glance-item" *ngFor="let item of atAGlanceData">
                <div class="glance-icon">
                  <mat-icon>{{ item.icon }}</mat-icon>
                </div>
                <div class="glance-info">
                  <div class="glance-value">{{ item.value }}</div>
                  <div class="glance-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Widget -->
          <div class="widget recent-activity">
            <div class="widget-header">
              <h3>Recent Activity</h3>
              <button class="view-all-btn">View All</button>
            </div>
            <div class="widget-content">
              <div class="activity-item" *ngFor="let activity of recentActivity">
                <div class="activity-icon" [style.background-color]="activity.color">
                  <mat-icon>{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-message">{{ activity.message }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Draft Widget -->
          <div class="widget quick-draft">
            <div class="widget-header">
              <h3>Quick Draft</h3>
            </div>
            <div class="widget-content">
              <form [formGroup]="draftForm" (ngSubmit)="saveDraft()">
                <div class="form-group">
                  <label for="draftTitle">Title</label>
                  <input 
                    type="text" 
                    id="draftTitle"
                    formControlName="title"
                    placeholder="Enter title..."
                    class="form-input">
                </div>
                <div class="form-group">
                  <label for="draftContent">Content</label>
                  <textarea 
                    id="draftContent"
                    formControlName="content"
                    placeholder="Write your draft here..."
                    rows="4"
                    class="form-textarea">
                  </textarea>
                </div>
                <div class="form-actions">
                  <button 
                    type="submit" 
                    class="save-btn"
                    [disabled]="draftForm.invalid || saving">
                    <mat-icon *ngIf="!saving">save</mat-icon>
                    <mat-spinner *ngIf="saving" diameter="16"></mat-spinner>
                    {{ saving ? 'Saving...' : 'Save Draft' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  kpiData: any[] = [];
  chartPeriods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ];
  selectedPeriod = '30d';

  lineChartData: ChartData = {
    labels: [],
    datasets: []
  };

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  pieChartData: ChartData = {
    labels: [],
    datasets: []
  };

  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  atAGlanceData: GlanceItem[] = [];
  recentActivity: ActivityItem[] = [];

  draftForm: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.draftForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load KPI data
    this.adminService.getDashboardStats().subscribe((stats: DashboardStats) => {
      this.kpiData = [
        {
          label: 'Total Registrations',
          value: stats.totalRegistrations,
          change: stats.registrationsTrend,
          icon: 'people',
          color: '#0073aa'
        },
        {
          label: 'Total Revenue',
          value: stats.totalRevenue,
          change: stats.revenueTrend,
          icon: 'attach_money',
          color: '#28a745'
        },
        {
          label: 'Paid Invoices',
          value: stats.paidInvoices,
          change: 0,
          icon: 'receipt',
          color: '#ffc107'
        },
        {
          label: 'Pending Approvals',
          value: stats.pendingApprovals,
          change: 0,
          icon: 'pending',
          color: '#dc3545'
        }
      ];
    });

    // Load chart data
    this.adminService.getRegistrationTrend(this.selectedPeriod).subscribe((data: ChartData) => {
      this.lineChartData = data;
    });

    this.adminService.getCategoryDistribution().subscribe((data: ChartData) => {
      this.pieChartData = data;
    });

    // Load widget data
    this.adminService.getAtAGlance().subscribe((data: GlanceItem[]) => {
      this.atAGlanceData = data;
    });

    this.adminService.getRecentActivity().subscribe((data: ActivityItem[]) => {
      this.recentActivity = data;
    });
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    this.updateChartData(period);
  }

  updateChartData(period: string) {
    this.adminService.getRegistrationTrend(period).subscribe((data: ChartData) => {
      this.lineChartData = data;
    });
  }

  saveDraft() {
    if (this.draftForm.valid) {
      this.saving = true;
      // Mock API call
      of({ success: true }).pipe(delay(1000)).subscribe(() => {
        this.saving = false;
        this.draftForm.reset();
        // Show success message
        console.log('Draft saved successfully');
      });
    }
  }
} 