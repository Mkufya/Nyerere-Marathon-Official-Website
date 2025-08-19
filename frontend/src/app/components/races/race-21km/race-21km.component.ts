import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaceDetails, AgeGroup, RaceKitItem } from '../race-5km/race-5km.component';

@Component({
  selector: 'app-race-21km',
  templateUrl: './race-21km.component.html',
  styleUrls: ['./race-21km.component.scss']
})
export class Race21kmComponent implements OnInit {
  raceDetails: RaceDetails = {
    name: '21KM Half Marathon',
    distance: '21.1 Kilometers (13.1 Miles)',
    description: 'Take on the ultimate endurance challenge with our Half Marathon! This prestigious race attracts serious runners from across East Africa. Experience the full marathon atmosphere while tackling a distance that demands respect, training, and determination.',
    startTime: '6:30 AM',
    location: 'Julius Nyerere International Convention Centre',
    registrationFee: '$40 USD / 30,000 TZS',
    cutoffTime: '2 hours 30 minutes',
    ageGroups: [
      { category: 'Elite (18-34)', ageRange: '18-34 years', requirements: 'Sub 1:30 qualifying time required' },
      { category: 'Open Men (18-39)', ageRange: '18-39 years' },
      { category: 'Open Women (18-39)', ageRange: '18-39 years' },
      { category: 'Masters Men (40-49)', ageRange: '40-49 years' },
      { category: 'Masters Women (40-49)', ageRange: '40-49 years' },
      { category: 'Veterans Men (50+)', ageRange: '50+ years' },
      { category: 'Veterans Women (50+)', ageRange: '50+ years' }
    ],
    qualificationDetails: [
      'Previous 10KM completion in under 60 minutes recommended',
      'Minimum 3 months of consistent training required',
      'Medical clearance mandatory for first-time participants',
      'Elite category requires qualifying time verification',
      'Age group prizes for top 3 finishers in each category'
    ],
    raceKit: [
      { item: 'Premium Race Bib', description: 'Professional timing chip with split tracking' },
      { item: 'Half Marathon Technical Shirt', description: 'Limited edition moisture-wicking race shirt' },
      { item: 'Finisher Medal', description: 'Heavy-weight commemorative medal with ribbon' },
      { item: 'Race Backpack', description: 'Premium sports backpack with logo' },
      { item: 'Recovery Pack', description: 'Energy bars, electrolyte drinks, and recovery supplements' },
      { item: 'Digital Certificate', description: 'Official race results and completion certificate' },
      { item: 'Photo Package', description: 'Access to professional race photos' }
    ],
    rules: [
      'Minimum age: 18 years old',
      'Medical certificate required (issued within 6 months)',
      'No personal pacing or support vehicles allowed',
      'Mandatory gear check at registration',
      'Aid stations every 3-5KM with water and sports drinks',
      'Cut-off times enforced at 10KM (1:15) and finish (2:30)',
      'Drop-out points available with medical support'
    ]
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  registerForRace(): void {
    // Navigate to registration form for this specific race
    this.router.navigate(['/register-race', '21km']);
  }

  downloadRouteMap(): void {
    this.router.navigate(['/race-info/route'], { 
      queryParams: { race: '21km' }
    });
  }
} 