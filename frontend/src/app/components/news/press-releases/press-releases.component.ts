import { Component, OnInit } from '@angular/core';

interface PressRelease {
  id: string;
  title: string;
  date: Date;
  summary: string;
  content: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-press-releases',
  templateUrl: './press-releases.component.html',
  styleUrls: ['./press-releases.component.scss']
})
export class PressReleasesComponent implements OnInit {

  pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'Nyerere Marathon 2025 Registration Now Open',
      date: new Date('2024-12-01'),
      summary: 'Registration for the 2025 Nyerere Marathon is officially open with exciting new features and prizes.',
      content: 'We are excited to announce that registration for the Nyerere Marathon 2025 is now open...',
      category: 'Registration',
      featured: true,
      imageUrl: 'assets/images/press/registration-2025.jpg'
    },
    {
      id: '2',
      title: 'New Route Announced for Half Marathon',
      date: new Date('2024-11-15'),
      summary: 'The half marathon will feature a new scenic route through Dar es Salaam historic district.',
      content: 'The 2025 half marathon will take runners on a beautiful journey...',
      category: 'Route',
      featured: false
    },
    {
      id: '3',
      title: 'Prize Money Increased by 50%',
      date: new Date('2024-10-20'),
      summary: 'Total prize money for all categories has been increased significantly for 2025.',
      content: 'We are pleased to announce a substantial increase in prize money...',
      category: 'Prizes',
      featured: true
    }
  ];

  featuredReleases: PressRelease[] = [];
  regularReleases: PressRelease[] = [];

  constructor() { }

  ngOnInit(): void {
    this.featuredReleases = this.pressReleases.filter(release => release.featured);
    this.regularReleases = this.pressReleases.filter(release => !release.featured);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
} 