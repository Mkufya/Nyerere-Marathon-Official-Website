import { Component, OnInit, OnDestroy } from '@angular/core';

export interface NewsItem {
  id: number;
  title: string;
  date: Date;
  description: string;
  image: string;
  category: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}



@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  newsItems: NewsItem[] = [];
  galleryImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;
  
  // Live streaming properties
  liveStreamUrl = 'https://player.castr.com/live_31dabe40323511f08b8efff0016f3b67';
  isLive = false;
  private liveCheckInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.loadNewsItems();
    this.loadGalleryImages();
    this.initializeLiveStreaming();
  }

  ngOnDestroy(): void {
    if (this.liveCheckInterval) {
      clearInterval(this.liveCheckInterval);
    }
  }

  private initializeLiveStreaming(): void {
    // Set the target date for the marathon (October 11, 2025)
    const targetDate = new Date('2025-10-11T06:00:00');
    const now = new Date();
    
    // Check if we're past the target date (stream should be live)
    if (now >= targetDate) {
      this.isLive = true;
    }
    this.startLiveStatusCheck();
  }

  private startLiveStatusCheck(): void {
    // Check live status every 30 seconds
    this.liveCheckInterval = setInterval(() => {
      this.checkLiveStatus();
    }, 30000);
    
    // Initial check
    this.checkLiveStatus();
  }

  private checkLiveStatus(): void {
    // In a real implementation, you would make an API call to check if the stream is actually live
    // For now, we'll simulate this based on the current time
    const now = new Date();
    const eventDate = new Date('2025-10-11T06:00:00');
    const eventEndDate = new Date('2025-10-11T14:00:00'); // Assuming 8-hour event
    
    this.isLive = now >= eventDate && now <= eventEndDate;
  }

  openFullscreen(): void {
    const iframe = document.querySelector('.live-stream-iframe') as HTMLIFrameElement;
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    }
  }

  shareStream(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Nyerere International Marathon 2025 - Live Stream',
        text: 'Watch the live coverage of the Mwl.Nyerere International Marathon 2025!',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // You could show a toast notification here
        console.log('Stream URL copied to clipboard');
      });
    }
  }

  private loadNewsItems(): void {
    this.newsItems = [
      {
        id: 1,
        title: 'Registration Opens for 2025 Marathon',
        date: new Date('2024-12-01'),
        description: 'Early bird registration is now open for the Mwl.Nyerere International Marathon 2025. Take advantage of discounted rates until January 31st.',
        image: 'https://via.placeholder.com/400x250/1976d2/ffffff?text=Registration+Open',
        category: 'Registration'
      },
      {
        id: 2,
        title: 'Route Certification Complete',
        date: new Date('2024-11-15'),
        description: 'The marathon route has been officially certified by the International Association of Athletics Federations (IAAF) for the 2025 race.',
        image: 'https://via.placeholder.com/400x250/2e7d32/ffffff?text=Route+Certified',
        category: 'Course'
      },
      {
        id: 3,
        title: 'International Elite Athletes Confirmed',
        date: new Date('2024-11-10'),
        description: 'World-class athletes from Kenya, Ethiopia, and Tanzania have confirmed their participation in the 2025 marathon.',
        image: 'https://via.placeholder.com/400x250/f57c00/ffffff?text=Elite+Athletes',
        category: 'Athletes'
      },
      {
        id: 4,
        title: 'Volunteer Program Launched',
        date: new Date('2024-11-01'),
        description: 'Join our volunteer program and be part of making the marathon a success. Various positions available with great benefits.',
        image: 'https://via.placeholder.com/400x250/7b1fa2/ffffff?text=Volunteers',
        category: 'Volunteers'
      }
    ];
  }

  private loadGalleryImages(): void {
    this.galleryImages = [
      {
        src: 'https://via.placeholder.com/400x300/1976d2/ffffff?text=Start+Line+2024',
        alt: 'Marathon Start Line 2024',
        caption: 'The exciting start of the 2024 marathon with over 5,000 participants'
      },
      {
        src: 'https://via.placeholder.com/400x300/2e7d32/ffffff?text=Finish+Line+Joy',
        alt: 'Finish Line Celebration',
        caption: 'Runners celebrating their achievement at the finish line'
      },
      {
        src: 'https://via.placeholder.com/400x300/f57c00/ffffff?text=Crowd+Support',
        alt: 'Crowd Support',
        caption: 'Amazing crowd support along the route'
      },
      {
        src: 'https://via.placeholder.com/400x300/7b1fa2/ffffff?text=Elite+Winners',
        alt: 'Elite Winners',
        caption: 'Winners of the 2024 marathon celebrating their victory'
      },
      {
        src: 'https://via.placeholder.com/400x300/d32f2f/ffffff?text=Community+Fun',
        alt: 'Community Fun Run',
        caption: 'Community members enjoying the fun run event'
      },
      {
        src: 'https://via.placeholder.com/400x300/388e3c/ffffff?text=Medical+Support',
        alt: 'Medical Support',
        caption: 'Medical teams providing support along the route'
      }
    ];
  }

  openImageModal(image: GalleryImage): void {
    this.selectedImage = image;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
} 