import { Component, OnInit } from '@angular/core';

interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  date: Date;
  category: string;
  description: string;
}

@Component({
  selector: 'app-media-gallery',
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.scss']
})
export class MediaGalleryComponent implements OnInit {

  mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Marathon 2024 Highlights',
      type: 'video',
      url: 'assets/videos/marathon-2024-highlights.mp4',
      thumbnailUrl: 'assets/images/gallery/marathon-2024-thumb.jpg',
      date: new Date('2024-10-15'),
      category: 'Event Coverage',
      description: 'Highlights from the 2024 Nyerere Marathon'
    },
    {
      id: '2',
      title: 'Winner Celebrations',
      type: 'image',
      url: 'assets/images/gallery/winners-2024.jpg',
      thumbnailUrl: 'assets/images/gallery/winners-2024-thumb.jpg',
      date: new Date('2024-10-15'),
      category: 'Results',
      description: 'Marathon winners celebrating their victory'
    },
    {
      id: '3',
      title: 'Route Preparation',
      type: 'image',
      url: 'assets/images/gallery/route-prep.jpg',
      thumbnailUrl: 'assets/images/gallery/route-prep-thumb.jpg',
      date: new Date('2024-10-10'),
      category: 'Preparation',
      description: 'Teams preparing the marathon route'
    }
  ];

  selectedCategory = 'All';
  categories = ['All', 'Event Coverage', 'Results', 'Preparation', 'Training'];
  filteredItems: MediaItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredItems = this.mediaItems;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredItems = this.mediaItems;
    } else {
      this.filteredItems = this.mediaItems.filter(item => item.category === category);
    }
  }

  openMedia(item: MediaItem): void {
    // Implement lightbox or modal functionality
    console.log('Opening media:', item.title);
  }
} 