import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p class="text-gray-600 dark:text-gray-400">Configure event settings and preferences</p>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Configuration</h3>
        <p class="text-gray-600 dark:text-gray-400">Settings functionality will be implemented here.</p>
        <p class="text-gray-600 dark:text-gray-400">Features will include:</p>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
          <li>Event setup (date/time)</li>
          <li>Registration toggles and limits</li>
          <li>Email templates and notifications</li>
          <li>Payment gateway configuration</li>
          <li>System preferences and security</li>
        </ul>
      </div>
    </div>
  `,
  styles: [``]
})
export class SettingsComponent {} 