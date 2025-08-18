import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface DashboardStats {
  totalRegistrations: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingApprovals: number;
  registrationsTrend: number;
  revenueTrend: number;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

export interface ActivityItem {
  id: number;
  message: string;
  time: string;
  icon: string;
  color: string;
  type: string;
  read: boolean;
}

export interface GlanceItem {
  label: string;
  value: string;
  icon: string;
}

export interface DraftData {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  getDashboardStats(): Observable<DashboardStats> {
    const mockStats: DashboardStats = {
      totalRegistrations: 0,
      totalRevenue: 0,
      paidInvoices: 0,
      pendingApprovals: 0,
      registrationsTrend: 0,
      revenueTrend: 0
    };

    return of(mockStats).pipe(delay(500));
  }

  getRegistrationTrend(period: string): Observable<ChartData> {
    const mockData: { [key: string]: ChartData } = {
      '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Registrations',
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: '#0073aa',
          backgroundColor: 'rgba(0, 115, 170, 0.1)',
          tension: 0.4
        }]
      },
      '30d': {
        labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Registrations',
          data: Array.from({length: 30}, () => 0),
          borderColor: '#0073aa',
          backgroundColor: 'rgba(0, 115, 170, 0.1)',
          tension: 0.4
        }]
      },
      '90d': {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Registrations',
          data: [0, 0, 0],
          borderColor: '#0073aa',
          backgroundColor: 'rgba(0, 115, 170, 0.1)',
          tension: 0.4
        }]
      },
      '1y': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Registrations',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#0073aa',
          backgroundColor: 'rgba(0, 115, 170, 0.1)',
          tension: 0.4
        }]
      }
    };

    return of(mockData[period] || mockData['30d']).pipe(delay(300));
  }

  getCategoryDistribution(): Observable<ChartData> {
    const mockData: ChartData = {
      labels: ['Full Marathon', 'Half Marathon', '10km', '5km'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#0073aa', '#28a745', '#ffc107', '#dc3545']
      }]
    };

    return of(mockData).pipe(delay(300));
  }

  getAtAGlance(): Observable<GlanceItem[]> {
    const mockData: GlanceItem[] = [
      { label: 'Total Registrations', value: '0', icon: 'people' },
      { label: 'Active Users', value: '0', icon: 'person' },
      { label: 'Media Files', value: '0', icon: 'photo_library' },
      { label: 'Published Posts', value: '0', icon: 'article' }
    ];

    return of(mockData).pipe(delay(200));
  }

  getRecentActivity(): Observable<ActivityItem[]> {
    const mockData: ActivityItem[] = [
      {
        id: 1,
        message: 'Welcome to the Marathon Admin Dashboard!',
        time: 'Just now',
        icon: 'dashboard',
        color: '#0073aa',
        type: 'system',
        read: false
      },
      {
        id: 2,
        message: 'No registrations yet. Start promoting the marathon!',
        time: 'Just now',
        icon: 'campaign',
        color: '#28a745',
        type: 'announcement',
        read: false
      },
      {
        id: 3,
        message: 'Dashboard is ready for your marathon management',
        time: 'Just now',
        icon: 'check_circle',
        color: '#ffc107',
        type: 'system',
        read: false
      }
    ];

    return of(mockData).pipe(delay(200));
  }

  saveDraft(draft: DraftData): Observable<{ success: boolean }> {
    // Mock API call
    console.log('Saving draft:', draft);
    return of({ success: true }).pipe(delay(1000));
  }

  markNotificationAsRead(id: number): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(200));
  }

  markAllNotificationsAsRead(): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(delay(300));
  }
}
