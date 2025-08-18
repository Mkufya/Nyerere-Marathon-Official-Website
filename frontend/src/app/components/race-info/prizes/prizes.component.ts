import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface PrizeCategory {
  position: number;
  male: number;
  female: number;
  ageGroup?: string;
}

interface RacePrizes {
  distance: string;
  totalPrize: number;
  currency: string;
  categories: {
    overall: PrizeCategory[];
    ageGroups: {
      groupName: string;
      ageRange: string;
      prizes: PrizeCategory[];
    }[];
  };
  specialPrizes: {
    name: string;
    amount: number;
    description: string;
  }[];
}

interface PrizeRules {
  title: string;
  description: string;
}

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit {
  selectedRace: string = '';
  raceDistances: string[] = ['5km', '10km', '21km', '42km'];
  currentPrizes: RacePrizes | null = null;

  allPrizes: { [key: string]: RacePrizes } = {
    '5km': {
      distance: '5KM Fun Run',
      totalPrize: 2500000,
      currency: 'TSH',
      categories: {
        overall: [
          { position: 1, male: 300000, female: 300000 },
          { position: 2, male: 200000, female: 200000 },
          { position: 3, male: 150000, female: 150000 },
          { position: 4, male: 100000, female: 100000 },
          { position: 5, male: 75000, female: 75000 }
        ],
        ageGroups: [
          {
            groupName: 'Youth Category',
            ageRange: '18-25',
            prizes: [
              { position: 1, male: 100000, female: 100000 },
              { position: 2, male: 75000, female: 75000 },
              { position: 3, male: 50000, female: 50000 }
            ]
          },
          {
            groupName: 'Veterans Category',
            ageRange: '50+',
            prizes: [
              { position: 1, male: 100000, female: 100000 },
              { position: 2, male: 75000, female: 75000 },
              { position: 3, male: 50000, female: 50000 }
            ]
          }
        ]
      },
      specialPrizes: [
        { name: 'Best Dressed', amount: 50000, description: 'Most creative running outfit' },
        { name: 'Team Spirit', amount: 50000, description: 'Best team coordination' }
      ]
    },
    '10km': {
      distance: '10KM Challenge',
      totalPrize: 5000000,
      currency: 'TSH',
      categories: {
        overall: [
          { position: 1, male: 500000, female: 500000 },
          { position: 2, male: 350000, female: 350000 },
          { position: 3, male: 250000, female: 250000 },
          { position: 4, male: 200000, female: 200000 },
          { position: 5, male: 150000, female: 150000 },
          { position: 6, male: 100000, female: 100000 },
          { position: 7, male: 75000, female: 75000 },
          { position: 8, male: 50000, female: 50000 }
        ],
        ageGroups: [
          {
            groupName: 'Youth Category',
            ageRange: '18-25',
            prizes: [
              { position: 1, male: 150000, female: 150000 },
              { position: 2, male: 100000, female: 100000 },
              { position: 3, male: 75000, female: 75000 }
            ]
          },
          {
            groupName: 'Veterans Category',
            ageRange: '50+',
            prizes: [
              { position: 1, male: 150000, female: 150000 },
              { position: 2, male: 100000, female: 100000 },
              { position: 3, male: 75000, female: 75000 }
            ]
          }
        ]
      },
      specialPrizes: [
        { name: 'Course Record', amount: 200000, description: 'New course record bonus' },
        { name: 'Local Hero', amount: 100000, description: 'Best Tanzanian runner' }
      ]
    },
    '21km': {
      distance: '21KM Half Marathon',
      totalPrize: 15000000,
      currency: 'TSH',
      categories: {
        overall: [
          { position: 1, male: 1500000, female: 1500000 },
          { position: 2, male: 1000000, female: 1000000 },
          { position: 3, male: 750000, female: 750000 },
          { position: 4, male: 500000, female: 500000 },
          { position: 5, male: 400000, female: 400000 },
          { position: 6, male: 300000, female: 300000 },
          { position: 7, male: 250000, female: 250000 },
          { position: 8, male: 200000, female: 200000 },
          { position: 9, male: 150000, female: 150000 },
          { position: 10, male: 100000, female: 100000 }
        ],
        ageGroups: [
          {
            groupName: 'Youth Category',
            ageRange: '18-25',
            prizes: [
              { position: 1, male: 300000, female: 300000 },
              { position: 2, male: 200000, female: 200000 },
              { position: 3, male: 150000, female: 150000 }
            ]
          },
          {
            groupName: 'Veterans Category',
            ageRange: '50+',
            prizes: [
              { position: 1, male: 300000, female: 300000 },
              { position: 2, male: 200000, female: 200000 },
              { position: 3, male: 150000, female: 150000 }
            ]
          }
        ]
      },
      specialPrizes: [
        { name: 'Course Record', amount: 500000, description: 'New course record bonus' },
        { name: 'Local Hero', amount: 300000, description: 'Best Tanzanian runner' },
        { name: 'Team Championship', amount: 200000, description: 'Best 3-person team time' }
      ]
    },
    '42km': {
      distance: '42KM Full Marathon',
      totalPrize: 30000000,
      currency: 'TSH',
      categories: {
        overall: [
          { position: 1, male: 3000000, female: 3000000 },
          { position: 2, male: 2000000, female: 2000000 },
          { position: 3, male: 1500000, female: 1500000 },
          { position: 4, male: 1000000, female: 1000000 },
          { position: 5, male: 750000, female: 750000 },
          { position: 6, male: 500000, female: 500000 },
          { position: 7, male: 400000, female: 400000 },
          { position: 8, male: 300000, female: 300000 },
          { position: 9, male: 250000, female: 250000 },
          { position: 10, male: 200000, female: 200000 },
          { position: 11, male: 150000, female: 150000 },
          { position: 12, male: 100000, female: 100000 }
        ],
        ageGroups: [
          {
            groupName: 'Youth Category',
            ageRange: '18-25',
            prizes: [
              { position: 1, male: 500000, female: 500000 },
              { position: 2, male: 350000, female: 350000 },
              { position: 3, male: 250000, female: 250000 }
            ]
          },
          {
            groupName: 'Veterans Category',
            ageRange: '50+',
            prizes: [
              { position: 1, male: 500000, female: 500000 },
              { position: 2, male: 350000, female: 350000 },
              { position: 3, male: 250000, female: 250000 }
            ]
          }
        ]
      },
      specialPrizes: [
        { name: 'Course Record', amount: 1000000, description: 'New course record bonus' },
        { name: 'Local Hero', amount: 500000, description: 'Best Tanzanian runner' },
        { name: 'Team Championship', amount: 300000, description: 'Best 3-person team time' },
        { name: 'Sub 2:30 Bonus', amount: 200000, description: 'Finishing under 2:30:00' }
      ]
    }
  };

  prizeRules: PrizeRules[] = [
    {
      title: 'Eligibility Requirements',
      description: 'Runners must be officially registered and complete the full race distance to be eligible for prizes.'
    },
    {
      title: 'Prize Distribution',
      description: 'Prize money will be distributed during the closing ceremony. Winners must be present to receive their prizes.'
    },
    {
      title: 'Age Categories',
      description: 'Age is calculated based on the runner\'s age on race day. Valid ID required for age verification.'
    },
    {
      title: 'Special Prizes',
      description: 'Special category prizes are awarded at the discretion of the organizing committee based on specific criteria.'
    },
    {
      title: 'Tax Obligations',
      description: 'Prize winners are responsible for any applicable taxes on prize money according to Tanzanian tax law.'
    },
    {
      title: 'Doping Control',
      description: 'Winners may be subject to doping control. Positive results will lead to disqualification and forfeiture of prizes.'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['race']) {
        this.selectedRace = params['race'];
        this.loadPrizes();
      }
    });
  }

  selectRace(race: string): void {
    this.selectedRace = race;
    this.loadPrizes();
  }

  loadPrizes(): void {
    if (this.selectedRace && this.allPrizes[this.selectedRace]) {
      this.currentPrizes = this.allPrizes[this.selectedRace];
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  goBack(): void {
    this.selectedRace = '';
    this.currentPrizes = null;
  }

  downloadPrizeInfo(): void {
    // Implement download functionality for prize information
    console.log('Downloading prize information...');
  }

  shareOnSocial(platform: string): void {
    // Implement social sharing functionality
    console.log(`Sharing on ${platform}...`);
  }
} 