import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th *ngFor="let column of columns" 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr *ngFor="let row of data">
              <td *ngFor="let column of columns" 
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ row[column.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [``]
})
export class DataTableComponent {
  @Input() title: string = 'Data Table';
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string }[] = [];
} 