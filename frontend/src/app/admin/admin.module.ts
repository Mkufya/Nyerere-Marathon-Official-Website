import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Charts
import { NgChartsModule } from 'ng2-charts';

// Admin Components
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminSidebarComponent } from './layout/admin-sidebar.component';
import { AdminTopbarComponent } from './layout/admin-topbar.component';

// Admin Pages
import { DashboardOverviewComponent } from './pages/dashboard-overview/dashboard-overview.component';
import { ParticipantsManagementComponent } from './pages/participants-management/participants-management.component';
import { PaymentManagementComponent } from './pages/payment-management/payment-management.component';
import { RaceCategoriesComponent } from './pages/race-categories/race-categories.component';
import { ResultsManagementComponent } from './pages/results-management/results-management.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { CmsComponent } from './pages/cms/cms.component';
import { MediaManagementComponent } from './pages/media-management/media-management.component';
import { VolunteersManagementComponent } from './pages/volunteers-management/volunteers-management.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { ReportsAnalyticsComponent } from './pages/reports-analytics/reports-analytics.component';

// Shared Components
import { ChartComponent } from './shared/chart.component';
import { DataTableComponent } from './shared/data-table.component';
import { ModalComponent } from './shared/modal.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner.component';
import { KpiCardComponent } from './shared/kpi-card.component';

// Pipes
import { AbsPipe } from '../shared/pipes/abs.pipe';
import { FileSizePipe } from '../shared/pipes/file-size.pipe';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      { path: 'participants', component: ParticipantsManagementComponent },
      { path: 'payments', component: PaymentManagementComponent },
      { path: 'categories', component: RaceCategoriesComponent },
      { path: 'results', component: ResultsManagementComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'cms', component: CmsComponent },
      { path: 'volunteers', component: VolunteersManagementComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'reports', component: ReportsAnalyticsComponent },
      { path: 'media', component: MediaManagementComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminTopbarComponent,
    DashboardOverviewComponent,
    ParticipantsManagementComponent,
    PaymentManagementComponent,
    RaceCategoriesComponent,
    ResultsManagementComponent,
    AnnouncementsComponent,
    CmsComponent,
    MediaManagementComponent,
    VolunteersManagementComponent,
    SettingsComponent,
    UserManagementComponent,
    ReportsAnalyticsComponent,
    ChartComponent,
    DataTableComponent,
    ModalComponent,
    LoadingSpinnerComponent,
    KpiCardComponent,
    AbsPipe,
    FileSizePipe
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule
  ]
})
export class AdminModule { } 