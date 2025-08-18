import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface RaceResult {
  position: number;
  name: string;
  country: string;
  time: string;
  pace: string;
  ageGroup: string;
  bibNumber: number;
}

interface RaceResultsData {
  year: number;
  distance: string;
  date: string;
  totalParticipants: number;
  weather: string;
  courseRecord: {
    male: RaceResult;
    female: RaceResult;
  };
  topResults: {
    male: RaceResult[];
    female: RaceResult[];
  };
  ageGroupWinners: {
    category: string;
    male: RaceResult;
    female: RaceResult;
  }[];
}

interface DownloadableResult {
  title: string;
  description: string;
  format: string;
  size: string;
  year: number;
  url: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  selectedRace: string = '';
  selectedYear: number = 2024;
  raceDistances: string[] = ['5km', '10km', '21km', '42km'];
  availableYears: number[] = [2024, 2023, 2022, 2021, 2020];
  currentResults: RaceResultsData | null = null;
  showMaleResults: boolean = true;

  // Sample results data
  allResults: { [key: string]: { [year: number]: RaceResultsData } } = {
    '5km': {
      2024: {
        year: 2024,
        distance: '5KM Fun Run',
        date: '2024-07-15',
        totalParticipants: 1250,
        weather: 'Partly Cloudy, 24°C',
        courseRecord: {
          male: {
            position: 1,
            name: 'John Mwangi',
            country: 'KEN',
            time: '14:32',
            pace: '2:54/km',
            ageGroup: 'Open',
            bibNumber: 101
          },
          female: {
            position: 1,
            name: 'Mary Keitany',
            country: 'KEN',
            time: '16:45',
            pace: '3:21/km',
            ageGroup: 'Open',
            bibNumber: 201
          }
        },
        topResults: {
          male: [
            { position: 1, name: 'John Mwangi', country: 'KEN', time: '14:32', pace: '2:54/km', ageGroup: 'Open', bibNumber: 101 },
            { position: 2, name: 'Paul Tergat', country: 'KEN', time: '14:58', pace: '2:59/km', ageGroup: 'Open', bibNumber: 102 },
            { position: 3, name: 'David Kimutai', country: 'KEN', time: '15:12', pace: '3:02/km', ageGroup: 'Open', bibNumber: 103 },
            { position: 4, name: 'Emmanuel Mutiso', country: 'TZA', time: '15:28', pace: '3:05/km', ageGroup: 'Open', bibNumber: 104 },
            { position: 5, name: 'Francis Kirui', country: 'KEN', time: '15:45', pace: '3:09/km', ageGroup: 'Open', bibNumber: 105 }
          ],
          female: [
            { position: 1, name: 'Mary Keitany', country: 'KEN', time: '16:45', pace: '3:21/km', ageGroup: 'Open', bibNumber: 201 },
            { position: 2, name: 'Catherine Ndereba', country: 'KEN', time: '17:12', pace: '3:26/km', ageGroup: 'Open', bibNumber: 202 },
            { position: 3, name: 'Derartu Tulu', country: 'ETH', time: '17:35', pace: '3:31/km', ageGroup: 'Open', bibNumber: 203 },
            { position: 4, name: 'Joyce Chepkirui', country: 'KEN', time: '17:58', pace: '3:35/km', ageGroup: 'Open', bibNumber: 204 },
            { position: 5, name: 'Gladys Cherono', country: 'KEN', time: '18:15', pace: '3:39/km', ageGroup: 'Open', bibNumber: 205 }
          ]
        },
        ageGroupWinners: [
          { category: 'U20', male: { position: 1, name: 'Peter Mumo', country: 'TZA', time: '16:15', pace: '3:15/km', ageGroup: 'U20', bibNumber: 301 }, female: { position: 1, name: 'Grace Wanjiru', country: 'KEN', time: '18:45', pace: '3:45/km', ageGroup: 'U20', bibNumber: 401 } },
          { category: '40-49', male: { position: 1, name: 'Robert Cheruiyot', country: 'KEN', time: '16:45', pace: '3:21/km', ageGroup: '40-49', bibNumber: 302 }, female: { position: 1, name: 'Lornah Kiplagat', country: 'NED', time: '19:15', pace: '3:51/km', ageGroup: '40-49', bibNumber: 402 } },
          { category: '50+', male: { position: 1, name: 'Haile Gebrselassie', country: 'ETH', time: '17:30', pace: '3:30/km', ageGroup: '50+', bibNumber: 303 }, female: { position: 1, name: 'Ingrid Kristiansen', country: 'NOR', time: '20:15', pace: '4:03/km', ageGroup: '50+', bibNumber: 403 } }
        ]
      }
    },
    '10km': {
      2024: {
        year: 2024,
        distance: '10KM Challenge',
        date: '2024-07-15',
        totalParticipants: 850,
        weather: 'Partly Cloudy, 24°C',
        courseRecord: {
          male: {
            position: 1,
            name: 'Geoffrey Kamworor',
            country: 'KEN',
            time: '28:15',
            pace: '2:49/km',
            ageGroup: 'Open',
            bibNumber: 501
          },
          female: {
            position: 1,
            name: 'Brigid Kosgei',
            country: 'KEN',
            time: '31:45',
            pace: '3:10/km',
            ageGroup: 'Open',
            bibNumber: 601
          }
        },
        topResults: {
          male: [
            { position: 1, name: 'Geoffrey Kamworor', country: 'KEN', time: '28:15', pace: '2:49/km', ageGroup: 'Open', bibNumber: 501 },
            { position: 2, name: 'Joshua Cheptegei', country: 'UGA', time: '28:32', pace: '2:51/km', ageGroup: 'Open', bibNumber: 502 },
            { position: 3, name: 'Kenenisa Bekele', country: 'ETH', time: '28:58', pace: '2:53/km', ageGroup: 'Open', bibNumber: 503 },
            { position: 4, name: 'Samson Lokolyang', country: 'TZA', time: '29:15', pace: '2:55/km', ageGroup: 'Open', bibNumber: 504 },
            { position: 5, name: 'Abel Kirui', country: 'KEN', time: '29:42', pace: '2:58/km', ageGroup: 'Open', bibNumber: 505 }
          ],
          female: [
            { position: 1, name: 'Brigid Kosgei', country: 'KEN', time: '31:45', pace: '3:10/km', ageGroup: 'Open', bibNumber: 601 },
            { position: 2, name: 'Ruth Chepngetich', country: 'KEN', time: '32:15', pace: '3:13/km', ageGroup: 'Open', bibNumber: 602 },
            { position: 3, name: 'Sifan Hassan', country: 'NED', time: '32:48', pace: '3:16/km', ageGroup: 'Open', bibNumber: 603 },
            { position: 4, name: 'Almaz Ayana', country: 'ETH', time: '33:15', pace: '3:19/km', ageGroup: 'Open', bibNumber: 604 },
            { position: 5, name: 'Vivian Cheruiyot', country: 'KEN', time: '33:45', pace: '3:22/km', ageGroup: 'Open', bibNumber: 605 }
          ]
        },
        ageGroupWinners: [
          { category: 'U20', male: { position: 1, name: 'Jacob Kiplimo', country: 'UGA', time: '30:15', pace: '3:01/km', ageGroup: 'U20', bibNumber: 701 }, female: { position: 1, name: 'Letesenbet Gidey', country: 'ETH', time: '34:30', pace: '3:27/km', ageGroup: 'U20', bibNumber: 801 } },
          { category: '40-49', male: { position: 1, name: 'Wilson Kipsang', country: 'KEN', time: '31:45', pace: '3:10/km', ageGroup: '40-49', bibNumber: 702 }, female: { position: 1, name: 'Edna Kiplagat', country: 'KEN', time: '35:15', pace: '3:31/km', ageGroup: '40-49', bibNumber: 802 } },
          { category: '50+', male: { position: 1, name: 'Abebe Bikila', country: 'ETH', time: '33:30', pace: '3:21/km', ageGroup: '50+', bibNumber: 703 }, female: { position: 1, name: 'Rosa Mota', country: 'POR', time: '37:45', pace: '3:46/km', ageGroup: '50+', bibNumber: 803 } }
        ]
      }
    },
    '21km': {
      2024: {
        year: 2024,
        distance: '21KM Half Marathon',
        date: '2024-07-15',
        totalParticipants: 2100,
        weather: 'Partly Cloudy, 24°C',
        courseRecord: {
          male: {
            position: 1,
            name: 'Kibiwott Kandie',
            country: 'KEN',
            time: '58:58',
            pace: '2:48/km',
            ageGroup: 'Open',
            bibNumber: 1001
          },
          female: {
            position: 1,
            name: 'Peres Jepchirchir',
            country: 'KEN',
            time: '1:05:16',
            pace: '3:06/km',
            ageGroup: 'Open',
            bibNumber: 1101
          }
        },
        topResults: {
          male: [
            { position: 1, name: 'Kibiwott Kandie', country: 'KEN', time: '58:58', pace: '2:48/km', ageGroup: 'Open', bibNumber: 1001 },
            { position: 2, name: 'Geoffrey Kamworor', country: 'KEN', time: '59:15', pace: '2:49/km', ageGroup: 'Open', bibNumber: 1002 },
            { position: 3, name: 'Abraham Kiptum', country: 'KEN', time: '59:35', pace: '2:50/km', ageGroup: 'Open', bibNumber: 1003 },
            { position: 4, name: 'Rhonex Kipruto', country: 'KEN', time: '1:00:05', pace: '2:51/km', ageGroup: 'Open', bibNumber: 1004 },
            { position: 5, name: 'Alexander Mutiso', country: 'TZA', time: '1:00:32', pace: '2:53/km', ageGroup: 'Open', bibNumber: 1005 }
          ],
          female: [
            { position: 1, name: 'Peres Jepchirchir', country: 'KEN', time: '1:05:16', pace: '3:06/km', ageGroup: 'Open', bibNumber: 1101 },
            { position: 2, name: 'Ruth Chepngetich', country: 'KEN', time: '1:05:45', pace: '3:07/km', ageGroup: 'Open', bibNumber: 1102 },
            { position: 3, name: 'Rosemary Wanjiru', country: 'KEN', time: '1:06:15', pace: '3:09/km', ageGroup: 'Open', bibNumber: 1103 },
            { position: 4, name: 'Hellen Obiri', country: 'KEN', time: '1:06:52', pace: '3:11/km', ageGroup: 'Open', bibNumber: 1104 },
            { position: 5, name: 'Agnes Tirop', country: 'KEN', time: '1:07:25', pace: '3:12/km', ageGroup: 'Open', bibNumber: 1105 }
          ]
        },
        ageGroupWinners: [
          { category: 'U20', male: { position: 1, name: 'Daniel Simiu', country: 'KEN', time: '1:02:15', pace: '2:58/km', ageGroup: 'U20', bibNumber: 1201 }, female: { position: 1, name: 'Celliphine Chespol', country: 'KEN', time: '1:09:30', pace: '3:18/km', ageGroup: 'U20', bibNumber: 1301 } },
          { category: '40-49', male: { position: 1, name: 'Eliud Kipchoge', country: 'KEN', time: '1:01:45', pace: '2:56/km', ageGroup: '40-49', bibNumber: 1202 }, female: { position: 1, name: 'Catherine Ndereba', country: 'KEN', time: '1:08:15', pace: '3:15/km', ageGroup: '40-49', bibNumber: 1302 } },
          { category: '50+', male: { position: 1, name: 'Khalid Khannouchi', country: 'USA', time: '1:05:30', pace: '3:07/km', ageGroup: '50+', bibNumber: 1203 }, female: { position: 1, name: 'Paula Radcliffe', country: 'GBR', time: '1:12:45', pace: '3:28/km', ageGroup: '50+', bibNumber: 1303 } }
        ]
      }
    },
    '42km': {
      2024: {
        year: 2024,
        distance: '42KM Full Marathon',
        date: '2024-07-15',
        totalParticipants: 3500,
        weather: 'Partly Cloudy, 24°C',
        courseRecord: {
          male: {
            position: 1,
            name: 'Kelvin Kiptum',
            country: 'KEN',
            time: '2:01:25',
            pace: '2:53/km',
            ageGroup: 'Open',
            bibNumber: 1501
          },
          female: {
            position: 1,
            name: 'Brigid Kosgei',
            country: 'KEN',
            time: '2:14:04',
            pace: '3:10/km',
            ageGroup: 'Open',
            bibNumber: 1601
          }
        },
        topResults: {
          male: [
            { position: 1, name: 'Kelvin Kiptum', country: 'KEN', time: '2:01:25', pace: '2:53/km', ageGroup: 'Open', bibNumber: 1501 },
            { position: 2, name: 'Eliud Kipchoge', country: 'KEN', time: '2:02:37', pace: '2:54/km', ageGroup: 'Open', bibNumber: 1502 },
            { position: 3, name: 'Kenenisa Bekele', country: 'ETH', time: '2:03:03', pace: '2:55/km', ageGroup: 'Open', bibNumber: 1503 },
            { position: 4, name: 'Birhanu Legese', country: 'ETH', time: '2:04:15', pace: '2:56/km', ageGroup: 'Open', bibNumber: 1504 },
            { position: 5, name: 'Mosinet Geremew', country: 'ETH', time: '2:04:45', pace: '2:57/km', ageGroup: 'Open', bibNumber: 1505 }
          ],
          female: [
            { position: 1, name: 'Brigid Kosgei', country: 'KEN', time: '2:14:04', pace: '3:10/km', ageGroup: 'Open', bibNumber: 1601 },
            { position: 2, name: 'Ruth Chepngetich', country: 'KEN', time: '2:15:25', pace: '3:12/km', ageGroup: 'Open', bibNumber: 1602 },
            { position: 3, name: 'Mary Keitany', country: 'KEN', time: '2:17:01', pace: '3:14/km', ageGroup: 'Open', bibNumber: 1603 },
            { position: 4, name: 'Gladys Cherono', country: 'KEN', time: '2:18:11', pace: '3:16/km', ageGroup: 'Open', bibNumber: 1604 },
            { position: 5, name: 'Roza Dereje', country: 'ETH', time: '2:18:30', pace: '3:16/km', ageGroup: 'Open', bibNumber: 1605 }
          ]
        },
        ageGroupWinners: [
          { category: 'U20', male: { position: 1, name: 'Tadese Tola', country: 'ETH', time: '2:08:15', pace: '3:03/km', ageGroup: 'U20', bibNumber: 1701 }, female: { position: 1, name: 'Gotytom Gebrslase', country: 'ETH', time: '2:23:39', pace: '3:25/km', ageGroup: 'U20', bibNumber: 1801 } },
          { category: '40-49', male: { position: 1, name: 'Wilson Kipsang', country: 'KEN', time: '2:06:58', pace: '3:01/km', ageGroup: '40-49', bibNumber: 1702 }, female: { position: 1, name: 'Edna Kiplagat', country: 'KEN', time: '2:21:52', pace: '3:23/km', ageGroup: '40-49', bibNumber: 1802 } },
          { category: '50+', male: { position: 1, name: 'Haile Gebrselassie', country: 'ETH', time: '2:15:25', pace: '3:12/km', ageGroup: '50+', bibNumber: 1703 }, female: { position: 1, name: 'Constantina Dita', country: 'ROU', time: '2:28:52', pace: '3:33/km', ageGroup: '50+', bibNumber: 1803 } }
        ]
      }
    }
  };

  downloadableResults: DownloadableResult[] = [
    { title: 'Complete Results 2024', description: 'All finishers with times and positions', format: 'PDF', size: '2.5MB', year: 2024, url: '/downloads/results-2024.pdf' },
    { title: 'Results Summary 2024', description: 'Top 100 in each category', format: 'PDF', size: '850KB', year: 2024, url: '/downloads/summary-2024.pdf' },
    { title: 'Age Group Results 2024', description: 'Winners by age categories', format: 'PDF', size: '1.2MB', year: 2024, url: '/downloads/age-groups-2024.pdf' },
    { title: 'Complete Results 2023', description: 'All finishers with times and positions', format: 'PDF', size: '2.3MB', year: 2023, url: '/downloads/results-2023.pdf' },
    { title: 'Results Summary 2023', description: 'Top 100 in each category', format: 'PDF', size: '800KB', year: 2023, url: '/downloads/summary-2023.pdf' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['race']) {
        this.selectedRace = params['race'];
        this.loadResults();
      }
    });
  }

  selectRace(race: string): void {
    this.selectedRace = race;
    this.loadResults();
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.loadResults();
  }

  loadResults(): void {
    if (this.selectedRace && this.allResults[this.selectedRace] && this.allResults[this.selectedRace][this.selectedYear]) {
      this.currentResults = this.allResults[this.selectedRace][this.selectedYear];
    } else {
      this.currentResults = null;
    }
  }

  toggleGender(showMale: boolean): void {
    this.showMaleResults = showMale;
  }

  getCurrentResults(): RaceResult[] {
    if (!this.currentResults) return [];
    return this.showMaleResults ? this.currentResults.topResults.male : this.currentResults.topResults.female;
  }

  getCountryFlag(countryCode: string): string {
    // This would typically use a flag API or local flag images
    return `🌍`; // Placeholder
  }

  downloadResults(format: string): void {
    console.log(`Downloading ${format} results...`);
    // Implement download functionality
  }

  shareResults(platform: string): void {
    console.log(`Sharing results on ${platform}...`);
    // Implement social sharing
  }

  goBack(): void {
    this.selectedRace = '';
    this.currentResults = null;
  }
} 