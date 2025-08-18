import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="app-container">
      <div class="pt-20">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 0;
      padding: 0;
      background: none;
    }
    body, html {
      margin: 0;
      padding: 0;
      background: none;
    }
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      background: none;
    }
  `]
})
export class AppComponent {
  title = 'Nyerere Marathon 2025';
} 