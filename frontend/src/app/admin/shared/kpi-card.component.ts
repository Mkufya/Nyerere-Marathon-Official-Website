import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="kpi-card" [class.trending-up]="change > 0" [class.trending-down]="change < 0">
      <div class="kpi-icon" [style.background-color]="iconColor">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="kpi-content">
        <div class="kpi-value">{{ value | number }}</div>
        <div class="kpi-label">{{ label }}</div>
        <div class="kpi-change" [class.positive]="change > 0" [class.negative]="change < 0">
          <mat-icon>{{ change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          {{ change | abs }}% from last month
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() change: number = 0;
  @Input() icon: string = '';
  @Input() iconColor: string = '#0073aa';
}
