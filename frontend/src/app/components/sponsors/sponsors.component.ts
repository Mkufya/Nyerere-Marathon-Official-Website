import { Component, OnInit } from '@angular/core';

export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website: string;
  description: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
}

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {
  sponsors: Sponsor[] = [];
  platinumSponsors: Sponsor[] = [];
  goldSponsors: Sponsor[] = [];
  silverSponsors: Sponsor[] = [];
  bronzeSponsors: Sponsor[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadSponsors();
    this.categorizeSponsorsByTier();
  }

  private loadSponsors(): void {
    this.sponsors = [
      // Platinum Sponsors
      {
        id: 1,
        name: 'Tanzania Airways',
        logo: 'https://via.placeholder.com/200x100/1976d2/ffffff?text=Tanzania+Airways',
        website: 'https://example.com',
        description: 'Official airline partner providing travel support for international participants.',
        tier: 'Platinum'
      },
      {
        id: 2,
        name: 'Kilimanjaro Bank',
        logo: 'https://via.placeholder.com/200x100/1976d2/ffffff?text=Kilimanjaro+Bank',
        website: 'https://example.com',
        description: 'Leading financial institution supporting sports development in Tanzania.',
        tier: 'Platinum'
      },
      
      // Gold Sponsors
      {
        id: 3,
        name: 'Serengeti Sports',
        logo: 'https://via.placeholder.com/200x100/ffc107/ffffff?text=Serengeti+Sports',
        website: 'https://example.com',
        description: 'Premium sports equipment and apparel provider.',
        tier: 'Gold'
      },
      {
        id: 4,
        name: 'Dar es Salaam Hotels',
        logo: 'https://via.placeholder.com/200x100/ffc107/ffffff?text=DSM+Hotels',
        website: 'https://example.com',
        description: 'Hospitality partner offering accommodation for marathon participants.',
        tier: 'Gold'
      },
      {
        id: 5,
        name: 'Tanzanian Telecom',
        logo: 'https://via.placeholder.com/200x100/ffc107/ffffff?text=TZ+Telecom',
        website: 'https://example.com',
        description: 'Communication services partner ensuring seamless connectivity.',
        tier: 'Gold'
      },
      
      // Silver Sponsors
      {
        id: 6,
        name: 'Healthy Living Foods',
        logo: 'https://via.placeholder.com/200x100/9e9e9e/ffffff?text=Healthy+Foods',
        website: 'https://example.com',
        description: 'Nutritional partner providing healthy food options for runners.',
        tier: 'Silver'
      },
      {
        id: 7,
        name: 'Fitness First Tanzania',
        logo: 'https://via.placeholder.com/200x100/9e9e9e/ffffff?text=Fitness+First',
        website: 'https://example.com',
        description: 'Leading fitness center chain supporting athlete training.',
        tier: 'Silver'
      },
      {
        id: 8,
        name: 'Medical Care Plus',
        logo: 'https://via.placeholder.com/200x100/9e9e9e/ffffff?text=Medical+Care',
        website: 'https://example.com',
        description: 'Healthcare partner providing medical support during the marathon.',
        tier: 'Silver'
      },
      
      // Bronze Sponsors
      {
        id: 9,
        name: 'Local Transport Co.',
        logo: 'https://via.placeholder.com/200x100/795548/ffffff?text=Transport+Co',
        website: 'https://example.com',
        description: 'Transportation services for marathon logistics.',
        tier: 'Bronze'
      },
      {
        id: 10,
        name: 'Community Radio',
        logo: 'https://via.placeholder.com/200x100/795548/ffffff?text=Community+Radio',
        website: 'https://example.com',
        description: 'Media partner providing event coverage and updates.',
        tier: 'Bronze'
      }
    ];
  }

  private categorizeSponsorsByTier(): void {
    this.platinumSponsors = this.sponsors.filter(sponsor => sponsor.tier === 'Platinum');
    this.goldSponsors = this.sponsors.filter(sponsor => sponsor.tier === 'Gold');
    this.silverSponsors = this.sponsors.filter(sponsor => sponsor.tier === 'Silver');
    this.bronzeSponsors = this.sponsors.filter(sponsor => sponsor.tier === 'Bronze');
  }

  getSponsorsByTier(tier: string): Sponsor[] {
    return this.sponsors.filter(sponsor => sponsor.tier === tier);
  }

  getTierColor(tier: string): string {
    switch (tier) {
      case 'Platinum': return '#1976d2';
      case 'Gold': return '#ffc107';
      case 'Silver': return '#9e9e9e';
      case 'Bronze': return '#795548';
      default: return '#666';
    }
  }

  visitSponsor(website: string): void {
    window.open(website, '_blank');
  }
} 