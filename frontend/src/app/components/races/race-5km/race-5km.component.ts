import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface RaceDetails {
  name: string;
  distance: string;
  description: string;
  startTime: string;
  location: string;
  ageGroups: AgeGroup[];
  qualificationDetails: string[];
  raceKit: RaceKitItem[];
  rules: string[];
  registrationFee: string;
  cutoffTime: string;
}

export interface AgeGroup {
  category: string;
  ageRange: string;
  requirements?: string;
}

export interface RaceKitItem {
  item: string;
  description: string;
}

@Component({
  selector: 'app-race-5km',
  templateUrl: './race-5km.component.html',
  styleUrls: ['./race-5km.component.scss']
})
export class Race5kmComponent implements OnInit {
  raceDetails: RaceDetails = {
    name: '5KM Fun Run',
    distance: '5 Kilometers',
    description: 'Perfect for beginners and families! Our 5KM Fun Run is designed to encourage participation from all fitness levels. Whether you\'re just starting your running journey or looking for a light warm-up, this race offers a supportive and energetic atmosphere.',
    startTime: '8:00 AM',
    location: 'Coco Beach, Dar es Salaam',
    registrationFee: '$15 USD / 35,000 TZS',
    cutoffTime: '60 minutes',
    ageGroups: [
      { category: 'Youth (Under 18)', ageRange: '10-17 years', requirements: 'Parental consent required' },
      { category: 'Open (18-39)', ageRange: '18-39 years' },
      { category: 'Masters (40+)', ageRange: '40+ years' }
    ],
    qualificationDetails: [
      'No previous running experience required',
      'Open to all fitness levels',
      'Great introduction to competitive running',
      'Family-friendly event with post-race activities'
    ],
    raceKit: [
      { item: 'Race Bib', description: 'Official race number with timing chip' },
      { item: 'Event T-Shirt', description: 'High-quality moisture-wicking fabric' },
      { item: 'Finisher Medal', description: 'Commemorative medal for all finishers' },
      { item: 'Race Bag', description: 'Reusable bag with sponsor materials' },
      { item: 'Refreshment Voucher', description: 'Post-race snacks and drinks' }
    ],
    rules: [
      'All participants must be registered and wear their race bib',
      'No headphones or music devices allowed for safety',
      'Follow the designated route and marshals\' instructions',
      'Medical assistance available at multiple points',
      'Participants under 18 must have guardian consent',
      'Race starts promptly at 8:00 AM - arrive 30 minutes early'
    ]
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  registerForRace(): void {
    // Navigate to registration form for this specific race
    this.router.navigate(['/register-race', '5km']);
  }

  downloadRouteMap(): void {
    // Navigate to route map page
    this.router.navigate(['/race-info/route'], { 
      queryParams: { race: '5km' }
    });
  }
} 