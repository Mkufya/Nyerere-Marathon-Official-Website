import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MediaService, MediaItem } from '../../../services/media.service';

@Component({
  selector: 'app-media-management',
  template: `
    <div class="media-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Media Management</h1>
            <p class="page-subtitle">Manage slider images, gallery photos, and media content</p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" (click)="openUploadDialog()">
              <mat-icon>cloud_upload</mat-icon>
              Upload Media
            </button>
            <button class="btn-secondary" (click)="refreshMedia()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>photo_library</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{getTotalMedia()}}</div>
            <div class="stat-label">Total Media</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>slideshow</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{getSliderImages()}}</div>
            <div class="stat-label">Slider Images</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>collections</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{getGalleryImages()}}</div>
            <div class="stat-label">Gallery Images</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>storage</mat-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{getTotalSize() | fileSize}}</div>
            <div class="stat-label">Total Size</div>
          </div>
        </div>
      </div>

      <!-- Media Grid -->
      <div class="media-grid">
        <div class="media-card" *ngFor="let item of mediaItems">
          <div class="media-preview">
            <img [src]="item.url" [alt]="item.title">
            <div class="media-overlay">
              <div class="media-actions">
                <button class="action-btn view" (click)="viewMedia(item)" title="View">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button class="action-btn edit" (click)="editMedia(item)" title="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button class="action-btn delete" (click)="deleteMedia(item)" title="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <div class="media-badge" [class]="getTypeClass(item.type)">
              {{item.type | titlecase}}
            </div>
          </div>
          <div class="media-info">
            <h4 class="media-title">{{item.title}}</h4>
            <p class="media-description" *ngIf="item.description">{{item.description}}</p>
            <div class="media-meta">
              <span class="meta-item">
                <mat-icon>schedule</mat-icon>
                {{item.uploadedAt | date:'short'}}
              </span>
              <span class="meta-item">
                <mat-icon>storage</mat-icon>
                {{item.size | fileSize}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./media-management.component.scss']
})
export class MediaManagementComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  mediaItems: MediaItem[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.getMediaItems().subscribe(
      (data) => {
        this.mediaItems = data;
      },
      (error) => {
        console.error('Error loading media:', error);
        this.snackBar.open('Failed to load media items.', 'Close', { duration: 3000 });
      }
    );
  }

  getTotalMedia(): number {
    return this.mediaItems.length;
  }

  getSliderImages(): number {
    return this.mediaItems.filter(item => item.type === 'slider').length;
  }

  getGalleryImages(): number {
    return this.mediaItems.filter(item => item.type === 'gallery').length;
  }

  getTotalSize(): number {
    return this.mediaItems.reduce((total, item) => total + item.size, 0);
  }

  getTypeClass(type: string): string {
    const classes: { [key: string]: string } = {
      slider: 'slider',
      gallery: 'gallery',
      news: 'news',
      sponsor: 'sponsor'
    };
    return classes[type] || 'default';
  }

  openUploadDialog(): void {
    this.snackBar.open('Upload functionality coming soon!', 'Close', { duration: 3000 });
  }

  viewMedia(item: MediaItem): void {
    this.snackBar.open(`Viewing: ${item.title}`, 'Close', { duration: 2000 });
  }

  editMedia(item: MediaItem): void {
    this.snackBar.open(`Editing: ${item.title}`, 'Close', { duration: 2000 });
  }

  deleteMedia(item: MediaItem): void {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.mediaService.deleteMedia(item.id).subscribe(
        () => {
          this.mediaItems = this.mediaItems.filter(media => media.id !== item.id);
          this.snackBar.open('Media deleted successfully!', 'Close', { duration: 3000 });
        },
        (error) => {
          console.error('Error deleting media:', error);
          this.snackBar.open('Failed to delete media.', 'Close', { duration: 3000 });
        }
      );
    }
  }

  refreshMedia(): void {
    this.loadMedia();
    this.snackBar.open('Media refreshed!', 'Close', { duration: 2000 });
  }
}
