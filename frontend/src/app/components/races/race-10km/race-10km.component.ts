import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaceDetails, AgeGroup, RaceKitItem } from '../race-5km/race-5km.component';

@Component({
  selector: 'app-race-10km',
  templateUrl: './race-10km.component.html',
  styleUrls: ['./race-10km.component.scss']
})
export class Race10kmComponent implements OnInit {
  raceDetails: RaceDetails = {
    name: '10KM Challenge',
    distance: '10 Kilometers',
    description: 'Step up your game with our 10KM Challenge! This race is perfect for recreational runners looking to push their limits. Experience the thrill of competitive racing while enjoying the scenic coastal route of Dar es Salaam.',
    startTime: '7:30 AM',
    location: 'Msimbazi Street to Coco Beach',
    registrationFee: '$25 USD / 60,000 TZS',
    cutoffTime: '90 minutes',
    ageGroups: [
      { category: 'Youth (16-17)', ageRange: '16-17 years', requirements: 'Parental consent and basic fitness level' },
      { category: 'Open (18-39)', ageRange: '18-39 years' },
      { category: 'Masters (40-49)', ageRange: '40-49 years' },
      { category: 'Veterans (50+)', ageRange: '50+ years' }
    ],
    qualificationDetails: [
      'Moderate fitness level recommended',
      'Previous 5KM completion suggested but not required',
      'Ideal for intermediate runners',
      'Competitive timing and awards for top finishers'
    ],
    raceKit: [
      { item: 'Race Bib with Timing Chip', description: 'Official race number with electronic timing' },
      { item: 'Technical Running Shirt', description: 'Premium moisture-wicking performance fabric' },
      { item: 'Finisher Medal', description: 'Unique design commemorative medal' },
      { item: 'Race Bag', description: 'High-quality drawstring bag with sponsor items' },
      { item: 'Energy Pack', description: 'Post-race recovery snacks and electrolyte drink' },
      { item: 'Certificate', description: 'Personalized completion certificate' }
    ],
    rules: [
      'Minimum age: 16 years old',
      'Race bib must be visible at all times',
      'No pacing devices or external assistance allowed',
      'Medical clearance recommended for first-time participants',
      'Water stations available every 2.5KM',
      'Cut-off time strictly enforced for safety'
    ]
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  registerForRace(): void {
    // Navigate to registration form for this specific race
    this.router.navigate(['/register-race', '10km']);
  }

  downloadRouteMap(): void {
    this.router.navigate(['/race-info/route'], { 
      queryParams: { race: '10km' }
    });
  }
} 