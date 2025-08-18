import { Component } from '@angular/core';

@Component({
  selector: 'app-cms',
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage static content pages</p>
        </div>
        <div class="flex space-x-3">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <mat-icon class="mr-2">add</mat-icon>
            Add Page
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Pages</h3>
        <p class="text-gray-600 dark:text-gray-400">CMS functionality will be implemented here.</p>
        <p class="text-gray-600 dark:text-gray-400">Features will include:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <li>Manage About, FAQs, Contact pages</li>
          <li>Rich text editor for content</li>
          <li>Page templates and layouts</li>
          <li>SEO optimization tools</li>
          <li>Content versioning and history</li>
        </ul>
      </div>
    </div>
  `,
  styles: [``]
})
export class CmsComponent {} 