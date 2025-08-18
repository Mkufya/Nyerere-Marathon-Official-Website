import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div *ngIf="isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600 dark:text-gray-400">{{ message }}</span>
    </div>
  `,
  styles: [``]
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Loading...';
} 