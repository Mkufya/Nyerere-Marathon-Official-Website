import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface RaceCategory {
  id: string;
  name: string;
  distance: string;
  startTime: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'inactive';
  description: string;
}

@Component({
  selector: 'app-race-categories',
  template: `
    <div class="race-categories-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Race Categories</h1>
            <p class="page-subtitle">Manage marathon race categories, pricing, and participant limits</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openAddDialog()">
              <mat-icon>add</mat-icon>
              Add Category
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>emoji_events</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ categories.length }}</div>
            <div class="stat-label">Total Categories</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>people</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalParticipants() }}</div>
            <div class="stat-label">Total Participants</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getActiveCategories() }}</div>
            <div class="stat-label">Active Categories</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getAveragePrice() | currency:'TZS' }}</div>
            <div class="stat-label">Average Price</div>
          </div>
        </div>
      </div>

      <!-- Categories Table -->
      <div class="content-card">
        <div class="card-header">
          <h2 class="card-title">Race Categories</h2>
          <div class="card-actions">
            <div class="search-box">
              <mat-icon>search</mat-icon>
              <input 
                type="text" 
                placeholder="Search categories..."
                [(ngModel)]="searchTerm"
                (input)="filterCategories()"
                class="search-input">
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Distance</th>
                <th>Start Time</th>
                <th>Price</th>
                <th>Participants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of filteredCategories" class="table-row">
                <td>
                  <div class="category-info">
                    <div class="category-name">{{ category.name }}</div>
                    <div class="category-description">{{ category.description }}</div>
                  </div>
                </td>
                <td>
                  <span class="distance-badge">{{ category.distance }}</span>
                </td>
                <td>{{ category.startTime }}</td>
                <td>
                  <span class="price">{{ category.price | currency:'TZS' }}</span>
                </td>
                <td>
                  <div class="participants-info">
                    <span class="participants-count">{{ category.currentParticipants }}/{{ category.maxParticipants }}</span>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        [style.width.%]="(category.currentParticipants / category.maxParticipants) * 100">
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    class="status-badge" 
                    [class.active]="category.status === 'active'"
                    [class.inactive]="category.status === 'inactive'">
                    {{ category.status | titlecase }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon edit" (click)="editCategory(category)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button class="btn-icon delete" (click)="deleteCategory(category)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div *ngIf="filteredCategories.length === 0" class="empty-state">
            <div class="empty-icon">
              <mat-icon>emoji_events</mat-icon>
            </div>
            <h3>No Race Categories Found</h3>
            <p>Get started by creating your first race category</p>
            <button class="btn-primary" (click)="openAddDialog()">
              <mat-icon>add</mat-icon>
              Create First Category
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./race-categories.component.scss']
})
export class RaceCategoriesComponent implements OnInit {
  categories: RaceCategory[] = [];
  filteredCategories: RaceCategory[] = [];
  searchTerm: string = '';
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      distance: ['', Validators.required],
      startTime: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      maxParticipants: [1000, [Validators.required, Validators.min(1)]],
      status: ['active', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categories = [
      {
        id: '1',
        name: 'Full Marathon',
        distance: '42km',
        startTime: '06:00',
        price: 30000,
        maxParticipants: 1000,
        currentParticipants: 0,
        status: 'active',
        description: 'The ultimate challenge - complete 42.2 kilometers'
      },
      {
        id: '2',
        name: 'Half Marathon',
        distance: '21km',
        startTime: '07:00',
        price: 30000,
        maxParticipants: 1500,
        currentParticipants: 0,
        status: 'active',
        description: 'Perfect for experienced runners - 21.1 kilometers'
      },
      {
        id: '3',
        name: '10km Run',
        distance: '10km',
        startTime: '08:00',
        price: 30000,
        maxParticipants: 2000,
        currentParticipants: 0,
        status: 'active',
        description: 'Great for intermediate runners - 10 kilometers'
      },
      {
        id: '4',
        name: '5km Fun Run',
        distance: '5km',
        startTime: '09:00',
        price: 30000,
        maxParticipants: 3000,
        currentParticipants: 0,
        status: 'active',
        description: 'Perfect for beginners and families - 5 kilometers'
      }
    ];
    this.filterCategories();
  }

  filterCategories() {
    if (!this.searchTerm) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        category.distance.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getTotalParticipants(): number {
    return this.categories.reduce((total, category) => total + category.currentParticipants, 0);
  }

  getActiveCategories(): number {
    return this.categories.filter(category => category.status === 'active').length;
  }

  getAveragePrice(): number {
    const activeCategories = this.categories.filter(category => category.status === 'active');
    if (activeCategories.length === 0) return 0;
    const totalPrice = activeCategories.reduce((sum, category) => sum + category.price, 0);
    return totalPrice / activeCategories.length;
  }

  openAddDialog() {
    // Implement add dialog
    console.log('Open add dialog');
  }

  editCategory(category: RaceCategory) {
    // Implement edit functionality
    console.log('Edit category:', category);
  }

  deleteCategory(category: RaceCategory) {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categories = this.categories.filter(c => c.id !== category.id);
      this.filterCategories();
    }
  }
} 