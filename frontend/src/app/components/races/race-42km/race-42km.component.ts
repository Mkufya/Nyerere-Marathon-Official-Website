import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaceDetails, AgeGroup, RaceKitItem } from '../race-5km/race-5km.component';

@Component({
  selector: 'app-race-42km',
  templateUrl: './race-42km.component.html',
  styleUrls: ['./race-42km.component.scss']
})
export class Race42kmComponent implements OnInit {
  raceDetails: RaceDetails = {
    name: '42KM Full Marathon',
    distance: '42.195 Kilometers (26.2 Miles)',
    description: 'The ultimate test of human endurance! Our Full Marathon is the crown jewel of the Nyerere Marathon series. This IAAF-certified course attracts elite athletes from around the world and offers qualifying opportunities for international marathons. Only the most dedicated and trained athletes should attempt this legendary distance.',
    startTime: '6:00 AM',
    location: 'Julius Nyerere International Convention Centre',
    registrationFee: '$60 USD / 140,000 TZS',
    cutoffTime: '6 hours',
    ageGroups: [
      { category: 'Elite Men', ageRange: '18-39 years', requirements: 'Sub 2:20 qualifying time required' },
      { category: 'Elite Women', ageRange: '18-39 years', requirements: 'Sub 2:45 qualifying time required' },
      { category: 'Open Men (18-34)', ageRange: '18-34 years' },
      { category: 'Open Women (18-34)', ageRange: '18-34 years' },
      { category: 'Open Men (35-39)', ageRange: '35-39 years' },
      { category: 'Open Women (35-39)', ageRange: '35-39 years' },
      { category: 'Masters Men (40-49)', ageRange: '40-49 years' },
      { category: 'Masters Women (40-49)', ageRange: '40-49 years' },
      { category: 'Veterans Men (50+)', ageRange: '50+ years' },
      { category: 'Veterans Women (50+)', ageRange: '50+ years' }
    ],
    qualificationDetails: [
      'Previous half marathon completion in under 2:15 required',
      'Minimum 6 months of structured marathon training required',
      'Medical clearance mandatory (comprehensive physical examination)',
      'Elite category requires IAAF-certified qualifying time',
      'Boston Marathon qualifying standards recognized',
      'Prize money for top 3 overall and Tanzanian finishers',
      'IAAF-certified course for record attempts'
    ],
    raceKit: [
      { item: 'Elite Race Bib', description: 'IAAF-certified timing chip with live tracking' },
      { item: 'Marathon Finisher Shirt', description: 'Premium technical fabric with marathon logo' },
      { item: 'Marathon Finisher Medal', description: 'Exclusive heavy-weight medal with custom design' },
      { item: 'Marathon Gear Bag', description: 'Professional sports duffel bag' },
      { item: 'Comprehensive Recovery Pack', description: 'Complete post-marathon nutrition and recovery kit' },
      { item: 'Official Results Package', description: 'Detailed split times and professional certificate' },
      { item: 'Professional Photo Package', description: 'Unlimited access to race day photography' },
      { item: 'Marathon Jacket', description: 'Exclusive finisher jacket for marathon completers' }
    ],
    rules: [
      'Minimum age: 20 years old',
      'Comprehensive medical certificate required (within 3 months)',
      'Proof of previous marathon or half marathon completion required',
      'No personal pacers allowed except in elite fields',
      'Mandatory gear requirements include emergency contact info',
      'Aid stations every 5KM with water, sports drinks, and nutrition',
      'Medical checkpoints at 21KM and 35KM',
      'Strict cut-off times: 21KM (2:45), 35KM (4:30), Finish (6:00)',
      'Drop-out transportation provided at designated points',
      'Post-race medical monitoring for all finishers'
    ]
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  registerForRace(): void {
    // Navigate to registration form for this specific race
    this.router.navigate(['/register-race', '42km']);
  }

  downloadRouteMap(): void {
    this.router.navigate(['/race-info/route'], { 
      queryParams: { race: '42km' }
    });
  }
} 