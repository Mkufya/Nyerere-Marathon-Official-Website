import { Component, OnInit } from '@angular/core';

interface CoverageItem {
  id: string;
  title: string;
  type: 'live' | 'recap' | 'highlights' | 'analysis';
  date: Date;
  summary: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  author: string;
  category: string;
  isLive?: boolean;
  viewCount?: number;
}

@Component({
  selector: 'app-event-coverage',
  templateUrl: './event-coverage.component.html',
  styleUrls: ['./event-coverage.component.scss']
})
export class EventCoverageComponent implements OnInit {

  coverageItems: CoverageItem[] = [
    {
      id: '1',
      title: 'Live Coverage: Nyerere Marathon 2024',
      type: 'live',
      date: new Date('2024-10-15'),
      summary: 'Complete live coverage of the 2024 Nyerere Marathon from start to finish.',
      mediaUrl: 'assets/videos/coverage/live-2024.mp4',
      thumbnailUrl: 'assets/images/coverage/live-thumb.jpg',
      duration: '4:32:15',
      author: 'Marathon TV Team',
      category: 'Full Event',
      isLive: false,
      viewCount: 15420
    },
    {
      id: '2',
      title: 'Marathon Highlights 2024',
      type: 'highlights',
      date: new Date('2024-10-16'),
      summary: 'Best moments and key highlights from the 2024 marathon.',
      mediaUrl: 'assets/videos/coverage/highlights-2024.mp4',
      thumbnailUrl: 'assets/images/coverage/highlights-thumb.jpg',
      duration: '12:45',
      author: 'Sports Media',
      category: 'Highlights',
      viewCount: 8932
    },
    {
      id: '3',
      title: 'Post-Race Analysis and Results',
      type: 'analysis',
      date: new Date('2024-10-17'),
      summary: 'Detailed analysis of race performance, records, and outstanding achievements.',
      mediaUrl: 'assets/videos/coverage/analysis-2024.mp4',
      thumbnailUrl: 'assets/images/coverage/analysis-thumb.jpg',
      duration: '28:30',
      author: 'Running Analytics',
      category: 'Analysis',
      viewCount: 6234
    },
    {
      id: '4',
      title: 'Behind the Scenes: Event Preparation',
      type: 'recap',
      date: new Date('2024-10-10'),
      summary: 'Exclusive look at the preparation and organization before the big day.',
      mediaUrl: 'assets/videos/coverage/behind-scenes.mp4',
      thumbnailUrl: 'assets/images/coverage/preparation-thumb.jpg',
      duration: '15:20',
      author: 'Event Team',
      category: 'Preparation',
      viewCount: 4567
    }
  ];

  selectedCategory = 'All';
  selectedType = 'All';
  categories = ['All', 'Full Event', 'Highlights', 'Analysis', 'Preparation'];
  types = ['All', 'live', 'recap', 'highlights', 'analysis'];
  filteredItems: CoverageItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredItems = this.coverageItems;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  filterByType(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.coverageItems;
    
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }
    
    if (this.selectedType !== 'All') {
      filtered = filtered.filter(item => item.type === this.selectedType);
    }
    
    this.filteredItems = filtered;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatViewCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  playVideo(item: CoverageItem): void {
    console.log('Playing video:', item.title);
    // Implement video player functionality
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'live':
        return 'fas fa-broadcast-tower';
      case 'recap':
        return 'fas fa-video';
      case 'highlights':
        return 'fas fa-star';
      case 'analysis':
        return 'fas fa-chart-line';
      default:
        return 'fas fa-play';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'live':
        return 'var(--red)';
      case 'recap':
        return 'var(--sky-blue)';
      case 'highlights':
        return 'var(--yellow)';
      case 'analysis':
        return 'var(--green)';
      default:
        return 'var(--navy-blue)';
    }
  }
} 