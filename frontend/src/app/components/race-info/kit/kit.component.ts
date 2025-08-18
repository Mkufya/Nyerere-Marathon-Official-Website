import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface KitCollection {
  location: string;
  address: string;
  schedule: KitSchedule[];
  checklist: string[];
  requirements: string[];
  contactInfo: ContactInfo;
}

export interface KitSchedule {
  date: string;
  time: string;
  note?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  emergency: string;
}

@Component({
  selector: 'app-kit',
  templateUrl: './kit.component.html',
  styleUrls: ['./kit.component.scss']
})
export class KitComponent implements OnInit {
  selectedRace = '';
  
  kitInfo: KitCollection = {
    location: 'Julius Nyerere International Convention Centre',
    address: 'Shaaban Robert Street, Kivukoni, Dar es Salaam',
    schedule: [
      {
        date: 'Friday, October 10, 2025',
        time: '9:00 AM - 6:00 PM',
        note: 'Regular collection hours'
      },
      {
        date: 'Saturday, October 11, 2025',
        time: '8:00 AM - 8:00 PM',
        note: 'Extended hours for weekend convenience'
      },
      {
        date: 'Sunday, October 12, 2025',
        time: '6:00 AM - 10:00 AM',
        note: 'Final collection - Race day morning only'
      }
    ],
    checklist: [
      'Valid government-issued photo ID (passport, national ID, or driver\'s license)',
      'Registration confirmation email (printed or digital)',
      'Medical certificate (for Half Marathon and Full Marathon participants)',
      'Proof of payment or receipt',
      'Emergency contact information form (completed)',
      'Parental consent form (for participants under 18)'
    ],
    requirements: [
      'Kit collection is mandatory - no race day pickup available',
      'Participants must collect their own kit in person',
      'Proxy collection allowed with notarized authorization letter',
      'Lost or damaged race numbers will incur a replacement fee of $10 USD',
      'Kit includes: race bib, timing chip, event t-shirt, race bag, and participant guide',
      'Late pickup after Sunday 10:00 AM will result in race disqualification'
    ],
    contactInfo: {
      phone: '+255 22 266 6061',
      email: 'racekit@nyereremarathon.org',
      emergency: '+255 754 123 456'
    }
  };

  raceSpecificInfo: { [key: string]: any } = {
    '5km': {
      category: '5KM Fun Run',
      kitItems: ['Race Bib', 'Event T-Shirt', 'Finisher Medal', 'Race Bag', 'Refreshment Voucher'],
      additionalNotes: 'Family-friendly pickup process with kids activity area available'
    },
    '10km': {
      category: '10KM Challenge',
      kitItems: ['Race Bib with Timing Chip', 'Technical Running Shirt', 'Finisher Medal', 'Race Bag', 'Energy Pack', 'Certificate'],
      additionalNotes: 'Electronic timing chip must be returned after race completion'
    },
    '21km': {
      category: '21KM Half Marathon',
      kitItems: ['Premium Race Bib', 'Half Marathon Technical Shirt', 'Finisher Medal', 'Race Backpack', 'Recovery Pack', 'Digital Certificate', 'Photo Package'],
      additionalNotes: 'Medical certificate verification required during pickup'
    },
    '42km': {
      category: '42KM Full Marathon',
      kitItems: ['Elite Race Bib', 'Marathon Finisher Shirt', 'Marathon Finisher Medal', 'Marathon Gear Bag', 'Comprehensive Recovery Pack', 'Official Results Package', 'Professional Photo Package', 'Marathon Jacket'],
      additionalNotes: 'IAAF timing chip included. Elite athletes have separate collection area.'
    }
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRace = params['race'] || '';
    });
  }

  getRaceInfo() {
    return this.raceSpecificInfo[this.selectedRace] || this.raceSpecificInfo['5km'];
  }

  downloadKitGuide(): void {
    // Simulate downloading kit collection guide
    console.log('Downloading kit collection guide...');
  }

  getDirections(): void {
    // Open Google Maps with directions
    const address = encodeURIComponent(this.kitInfo.address);
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  }
} 