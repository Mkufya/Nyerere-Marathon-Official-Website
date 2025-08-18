import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'slider' | 'gallery' | 'news' | 'sponsor';
  category: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  isActive: boolean;
  order?: number;
}

export interface MediaStats {
  total: number;
  byType: {
    slider: number;
    gallery: number;
    news: number;
    sponsor: number;
  };
  byStatus: {
    active: number;
    inactive: number;
  };
  totalSize: number;
}

export interface UploadResponse {
  message: string;
  media: MediaItem;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all media items with optional filters
  getMediaItems(filters?: {
    type?: string;
    category?: string;
    isActive?: boolean;
  }): Observable<MediaItem[]> {
    let url = `${this.apiUrl}/media`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<MediaItem[]>(url);
  }

  // Get media item by ID
  getMediaItem(id: string): Observable<MediaItem> {
    return this.http.get<MediaItem>(`${this.apiUrl}/media/${id}`);
  }

  // Upload new media
  uploadMedia(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.apiUrl}/media/upload`, formData);
  }

  // Update media item
  updateMedia(id: string, updateData: Partial<MediaItem>): Observable<{ message: string; media: MediaItem }> {
    return this.http.put<{ message: string; media: MediaItem }>(`${this.apiUrl}/media/${id}`, updateData);
  }

  // Delete media item
  deleteMedia(id: string): Observable<{ message: string; media: MediaItem }> {
    return this.http.delete<{ message: string; media: MediaItem }>(`${this.apiUrl}/media/${id}`);
  }

  // Get media statistics
  getMediaStats(): Observable<MediaStats> {
    return this.http.get<MediaStats>(`${this.apiUrl}/media/stats/overview`);
  }

  // Get slider images
  getSliderImages(): Observable<MediaItem[]> {
    return this.getMediaItems({ type: 'slider', isActive: true });
  }

  // Get gallery images
  getGalleryImages(): Observable<MediaItem[]> {
    return this.getMediaItems({ type: 'gallery', isActive: true });
  }

  // Get news images
  getNewsImages(): Observable<MediaItem[]> {
    return this.getMediaItems({ type: 'news', isActive: true });
  }

  // Get sponsor images
  getSponsorImages(): Observable<MediaItem[]> {
    return this.getMediaItems({ type: 'sponsor', isActive: true });
  }
}
