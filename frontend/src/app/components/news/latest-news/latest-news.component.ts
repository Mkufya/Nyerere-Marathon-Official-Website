import { Component, OnInit } from '@angular/core';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  image: string;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  category: string;
}

export interface PressRelease {
  id: string;
  title: string;
  summary: string;
  date: Date;
  pdfUrl: string;
}

@Component({
  selector: 'app-latest-news',
  templateUrl: './latest-news.component.html',
  styleUrls: ['./latest-news.component.scss']
})
export class LatestNewsComponent implements OnInit {
  latestNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Nyerere Marathon 2025: Registration Now Open!',
      summary: 'Early bird registration is now open for all race categories. Secure your spot in Tanzania\'s premier running event.',
      content: 'We are excited to announce that registration for the Nyerere Marathon 2025 is officially open! This year\'s event promises to be our biggest and most spectacular yet, with improved routes, enhanced safety measures, and exciting new features.',
      author: 'Marathon Committee',
      publishDate: new Date('2024-01-15'),
      category: 'Registration',
      image: 'assets/images/registration-open.jpg',
      featured: true
    },
    {
      id: '2',
      title: 'Elite Athletes Confirmed for 2025 Race',
      summary: 'World-class marathoners from Kenya, Ethiopia, and Tanzania have confirmed their participation.',
      content: 'The elite field for Nyerere Marathon 2025 is shaping up to be exceptional. We have confirmed participation from several world-class athletes who will compete for the substantial prize pool.',
      author: 'Sports Desk',
      publishDate: new Date('2024-01-10'),
      category: 'Athletes',
      image: 'assets/images/elite-athletes.jpg',
      featured: true
    },
    {
      id: '3',
      title: 'New Route Enhancements for Scenic Experience',
      summary: 'Experience Dar es Salaam\'s beautiful coastline with our enhanced route that showcases the city\'s best landmarks.',
      content: 'Based on feedback from previous years, we have made significant improvements to the marathon route. The new course will take runners through some of Dar es Salaam\'s most scenic areas.',
      author: 'Route Planning Team',
      publishDate: new Date('2024-01-05'),
      category: 'Route',
      image: 'assets/images/route-enhancement.jpg',
      featured: false
    },
    {
      id: '4',
      title: 'Medical Support and Safety Measures Enhanced',
      summary: 'Comprehensive medical coverage with additional support stations and emergency response teams.',
      content: 'Participant safety is our top priority. This year, we have significantly enhanced our medical support infrastructure with more medical stations and faster emergency response capabilities.',
      author: 'Medical Team',
      publishDate: new Date('2024-01-01'),
      category: 'Safety',
      image: 'assets/images/medical-support.jpg',
      featured: false
    },
    {
      id: '5',
      title: 'Local Community Embraces Marathon Spirit',
      summary: 'Local schools and communities prepare for marathon weekend with various supporting events.',
      content: 'The local community in Dar es Salaam has embraced the marathon spirit with enthusiasm. Schools and community groups are organizing various events to support the marathon weekend.',
      author: 'Community Relations',
      publishDate: new Date('2023-12-28'),
      category: 'Community',
      image: 'assets/images/community-support.jpg',
      featured: false
    },
    {
      id: '6',
      title: 'Sustainability Initiatives for Green Marathon',
      summary: 'Environmental consciousness takes center stage with plastic-free water stations and eco-friendly race materials.',
      content: 'In line with global sustainability trends, the Nyerere Marathon 2025 will implement several eco-friendly initiatives including plastic-free water stations and biodegradable race materials.',
      author: 'Environmental Team',
      publishDate: new Date('2023-12-20'),
      category: 'Environment',
      image: 'assets/images/green-marathon.jpg',
      featured: false
    }
  ];

  galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Start Line Excitement',
      caption: 'Runners at the starting line of the 2024 marathon',
      image: 'assets/images/gallery/start-line.jpg',
      category: 'highlights'
    },
    {
      id: '2',
      title: 'Elite Runners',
      caption: 'Professional athletes competing in the marathon',
      image: 'assets/images/gallery/elite-runners.jpg',
      category: 'photos'
    },
    {
      id: '3',
      title: 'Community Support',
      caption: 'Local community cheering for runners',
      image: 'assets/images/gallery/community-support.jpg',
      category: 'photos'
    },
    {
      id: '4',
      title: 'Finish Line Celebration',
      caption: 'Runners celebrating at the finish line',
      image: 'assets/images/gallery/finish-line.jpg',
      category: 'highlights'
    },
    {
      id: '5',
      title: 'Route Scenery',
      caption: 'Beautiful views along the marathon route',
      image: 'assets/images/gallery/route-scenery.jpg',
      category: 'photos'
    },
    {
      id: '6',
      title: 'Awards Ceremony',
      caption: 'Winners receiving their medals',
      image: 'assets/images/gallery/awards-ceremony.jpg',
      category: 'videos'
    }
  ];

  pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'Nyerere Marathon 2025 Official Launch',
      summary: 'Official announcement of the 2025 marathon with new features and improvements.',
      date: new Date('2024-01-15'),
      pdfUrl: 'assets/press-releases/marathon-2025-launch.pdf'
    },
    {
      id: '2',
      title: 'Route Certification Announcement',
      summary: 'Official certification of the marathon route by international standards.',
      date: new Date('2024-01-10'),
      pdfUrl: 'assets/press-releases/route-certification.pdf'
    },
    {
      id: '3',
      title: 'Sponsorship Partners 2025',
      summary: 'Announcement of major sponsors and partners for the 2025 event.',
      date: new Date('2024-01-05'),
      pdfUrl: 'assets/press-releases/sponsorship-partners.pdf'
    }
  ];

  featuredNews: NewsArticle[] = [];
  regularNews: NewsArticle[] = [];

  constructor() { }

  ngOnInit(): void {
    this.categorizeNews();
  }

  private categorizeNews(): void {
    this.featuredNews = this.latestNews.filter(article => article.featured);
    this.regularNews = this.latestNews.filter(article => !article.featured);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Registration': '#007bff',
      'Athletes': '#28a745',
      'Route': '#ffc107',
      'Safety': '#dc3545',
      'Community': '#6f42c1',
      'Environment': '#20c997'
    };
    return colors[category] || '#6c757d';
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  }

  readMore(article: NewsArticle): void {
    // Navigate to full article view
    console.log('Read more:', article.title);
  }

  downloadPressRelease(release: PressRelease): void {
    // Download PDF functionality
    console.log('Downloading:', release.title);
  }

  subscribeNewsletter(email: string): void {
    // Newsletter subscription functionality
    console.log('Subscribing:', email);
  }
} 