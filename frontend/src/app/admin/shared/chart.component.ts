import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
      <div class="h-64 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">Chart component will be implemented here</p>
      </div>
    </div>
  `,
  styles: [``]
})
export class ChartComponent {
  @Input() title: string = 'Chart';
  @Input() data: any[] = [];
  @Input() type: 'bar' | 'line' | 'pie' = 'bar';
} 