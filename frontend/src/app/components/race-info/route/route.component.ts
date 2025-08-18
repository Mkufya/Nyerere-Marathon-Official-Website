import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface RouteDetails {
  name: string;
  distance: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  startLocation: string;
  endLocation: string;
  mapUrl: string;
  elevationProfile: string;
  waypoints: Waypoint[];
  highlights: string[];
  safety: string[];
  weather: {
    temperature: string;
    humidity: string;
    wind: string;
  };
  downloads: DownloadLink[];
}

export interface Waypoint {
  km: number;
  location: string;
  description: string;
  services: string[];
}

export interface DownloadLink {
  format: string;
  type: string;
  url: string;
  size: string;
}

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit {
  selectedRace = '';
  raceDistances = ['5km', '10km', '21km', '42km'];
  
  routeDetails: { [key: string]: RouteDetails } = {
    '5km': {
      name: '5KM Fun Run',
      distance: '5 Kilometers',
      difficulty: 'Easy',
      estimatedTime: '25-40 minutes',
      description: 'A flat, beginner-friendly course along the beautiful coastline of Dar es Salaam with scenic views of the Indian Ocean.',
      startLocation: 'Coco Beach Main Entrance',
      endLocation: 'Coco Beach Festival Area',
      mapUrl: 'assets/images/route-maps/5km-route.png',
      elevationProfile: 'assets/images/elevation/5km-elevation.png',
      waypoints: [
        {
          km: 0,
          location: 'Coco Beach Main Entrance',
          description: 'Starting line with timing mats',
          services: ['Registration check', 'Baggage drop', 'Toilets', 'Medical station']
        },
        {
          km: 2.5,
          location: 'Msimbazi Creek Bridge',
          description: 'Midway point with scenic creek views',
          services: ['Water station', 'Spectator area', 'Photography point']
        },
        {
          km: 5,
          location: 'Coco Beach Festival Area',
          description: 'Finish line with celebration area',
          services: ['Finish line timing', 'Medal ceremony', 'Refreshments', 'Medical station']
        }
      ],
      highlights: [
        'Flat, beginner-friendly course along the coastline',
        'Scenic views of the Indian Ocean throughout the route',
        'Family-friendly with multiple spectator viewing areas',
        'Fully paved surface with minimal elevation changes'
      ],
      safety: [
        'Route is closed to traffic during event hours',
        'Medical stations every 2.5km with trained personnel',
        'Clear route markings and directional signage',
        'Safety marshals positioned at key intersections'
      ],
      weather: {
        temperature: '24-28°C',
        humidity: '65-75%',
        wind: '10-15 km/h'
      },
      downloads: [
        { format: 'PDF Map', type: 'pdf', url: '/downloads/5km-route-map.pdf', size: '2.1 MB' },
        { format: 'GPX Track', type: 'gpx', url: '/downloads/5km-route.gpx', size: '12 KB' },
        { format: 'Mobile App', type: 'apk', url: '/downloads/race-app.apk', size: '15 MB' }
      ]
    },
    '10km': {
      name: '10KM Challenge',
      distance: '10 Kilometers',
      difficulty: 'Moderate',
      estimatedTime: '45-65 minutes',
      description: 'An urban coastal route showcasing Dar es Salaam\'s diversity from traditional fish markets to modern city districts.',
      startLocation: 'Coco Beach Main Entrance',
      endLocation: 'Slipway Shopping Centre',
      mapUrl: 'assets/images/route-maps/10km-route.png',
      elevationProfile: 'assets/images/elevation/10km-elevation.png',
      waypoints: [
        {
          km: 0,
          location: 'Coco Beach Main Entrance',
          description: 'Starting line with timing mats',
          services: ['Registration check', 'Baggage drop', 'Toilets', 'Medical station']
        },
        {
          km: 2.5,
          location: 'Fish Market Area',
          description: 'Local cultural hub with vibrant atmosphere',
          services: ['Water station', 'Spectator area', 'Local entertainment']
        },
        {
          km: 5,
          location: 'Kivukoni Front',
          description: 'Historic waterfront with city skyline views',
          services: ['Water station', 'Energy drinks', 'Photography point', 'Medical station']
        },
        {
          km: 7.5,
          location: 'Peninsula Hotel Area',
          description: 'Upscale district with modern architecture',
          services: ['Water station', 'Cooling mist station', 'Spectator area']
        },
        {
          km: 10,
          location: 'Slipway Shopping Centre',
          description: 'Finish line with shopping and dining facilities',
          services: ['Finish line timing', 'Medal ceremony', 'Refreshments', 'Medical station', 'Shopping']
        }
      ],
      highlights: [
        'Urban coastal route showcasing Dar es Salaam\'s diversity',
        'Mix of traditional fish markets and modern city districts',
        'Moderate difficulty with gentle rolling hills',
        'Cultural immersion through local neighborhoods'
      ],
      safety: [
        'Traffic control at all major intersections',
        'Medical stations every 2.5km with ambulance support',
        'Police escorts at busy road crossings',
        'Emergency contact numbers displayed at each waypoint'
      ],
      weather: {
        temperature: '25-29°C',
        humidity: '70-80%',
        wind: '12-18 km/h'
      },
      downloads: [
        { format: 'PDF Map', type: 'pdf', url: '/downloads/10km-route-map.pdf', size: '3.2 MB' },
        { format: 'GPX Track', type: 'gpx', url: '/downloads/10km-route.gpx', size: '18 KB' },
        { format: 'Turn-by-Turn Guide', type: 'pdf', url: '/downloads/10km-directions.pdf', size: '1.8 MB' }
      ]
    },
    '21km': {
      name: '21KM Half Marathon',
      distance: '21.1 Kilometers',
      difficulty: 'Challenging',
      estimatedTime: '1.5-2.5 hours',
      description: 'A historic route through Dar es Salaam\'s key landmarks with diverse terrain from stadium to waterfront.',
      startLocation: 'National Stadium',
      endLocation: 'Uhuru Monument',
      mapUrl: 'assets/images/route-maps/21km-route.png',
      elevationProfile: 'assets/images/elevation/21km-elevation.png',
      waypoints: [
        {
          km: 0,
          location: 'National Stadium',
          description: 'Iconic starting point with stadium facilities',
          services: ['Registration check', 'Baggage drop', 'Toilets', 'Medical station', 'Warm-up area']
        },
        {
          km: 5,
          location: 'University of Dar es Salaam',
          description: 'Academic district with student support',
          services: ['Water station', 'Energy drinks', 'Student cheering section', 'Medical station']
        },
        {
          km: 10,
          location: 'Kariakoo Market',
          description: 'Bustling commercial center',
          services: ['Water station', 'Local refreshments', 'Cultural performances', 'Medical station']
        },
        {
          km: 15,
          location: 'Kivukoni Ferry Terminal',
          description: 'Historic ferry crossing point',
          services: ['Water station', 'Energy gels', 'Harbor views', 'Medical station']
        },
        {
          km: 21.1,
          location: 'Uhuru Monument',
          description: 'Finish line at historic independence monument',
          services: ['Finish line timing', 'Medal ceremony', 'Recovery area', 'Medical station', 'Photography']
        }
      ],
      highlights: [
        'Historic route through Dar es Salaam\'s key landmarks',
        'Diverse terrain from stadium to waterfront',
        'Cultural immersion through local markets and university area',
        'Challenging but rewarding course with varied elevations'
      ],
      safety: [
        'Full road closure with police escort throughout',
        'Medical stations every 5km with qualified medical staff',
        'Motorcycle support riders throughout the course',
        'Emergency vehicle access at all major points'
      ],
      weather: {
        temperature: '26-30°C',
        humidity: '75-85%',
        wind: '8-12 km/h'
      },
      downloads: [
        { format: 'PDF Map', type: 'pdf', url: '/downloads/21km-route-map.pdf', size: '4.5 MB' },
        { format: 'GPX Track', type: 'gpx', url: '/downloads/21km-route.gpx', size: '25 KB' },
        { format: 'Elevation Profile', type: 'pdf', url: '/downloads/21km-elevation.pdf', size: '1.2 MB' },
        { format: 'Pacing Guide', type: 'pdf', url: '/downloads/21km-pacing.pdf', size: '800 KB' }
      ]
    },
    '42km': {
      name: '42KM Full Marathon',
      distance: '42.195 Kilometers',
      difficulty: 'Elite',
      estimatedTime: '3-5 hours',
      description: 'An IAAF-certified course meeting international standards with comprehensive city tour from stadium to state house.',
      startLocation: 'National Stadium',
      endLocation: 'State House Grounds',
      mapUrl: 'assets/images/route-maps/42km-route.png',
      elevationProfile: 'assets/images/elevation/42km-elevation.png',
      waypoints: [
        {
          km: 0,
          location: 'National Stadium',
          description: 'Elite starting point with international timing',
          services: ['Elite registration', 'Baggage drop', 'Toilets', 'Medical station', 'Warm-up track']
        },
        {
          km: 10,
          location: 'Msimbazi Valley',
          description: 'Scenic valley with natural beauty',
          services: ['Water station', 'Energy drinks', 'Medical station', 'Elite support']
        },
        {
          km: 21.1,
          location: 'Uhuru Monument',
          description: 'Half marathon split point',
          services: ['Split timing', 'Water station', 'Energy gels', 'Medical station', 'Spectator area']
        },
        {
          km: 30,
          location: 'Mwenge Area',
          description: 'Northern suburbs with community support',
          services: ['Water station', 'Energy drinks', 'Local food', 'Medical station', 'Massage area']
        },
        {
          km: 35,
          location: 'New Bagamoyo Road',
          description: 'Modern highway section',
          services: ['Water station', 'Energy gels', 'Medical station', 'Pacing support']
        },
        {
          km: 42.195,
          location: 'State House Grounds',
          description: 'Prestigious finish line with ceremonial atmosphere',
          services: ['Finish line timing', 'Medal ceremony', 'Recovery area', 'Medical station', 'VIP area']
        }
      ],
      highlights: [
        'IAAF-certified course meeting international standards',
        'Comprehensive city tour from stadium to state house',
        'Challenging elevation profile testing elite athletes',
        'Multiple climate zones from urban to suburban areas'
      ],
      safety: [
        'Full course closure with military and police support',
        'Medical stations every 5km with ambulance coverage',
        'Helicopter medical evacuation capability',
        'Professional course marshals throughout'
      ],
      weather: {
        temperature: '28-32°C',
        humidity: '80-90%',
        wind: '5-10 km/h'
      },
      downloads: [
        { format: 'PDF Map', type: 'pdf', url: '/downloads/42km-route-map.pdf', size: '6.8 MB' },
        { format: 'GPX Track', type: 'gpx', url: '/downloads/42km-route.gpx', size: '35 KB' },
        { format: 'Elevation Profile', type: 'pdf', url: '/downloads/42km-elevation.pdf', size: '2.1 MB' },
        { format: 'Pacing Guide', type: 'pdf', url: '/downloads/42km-pacing.pdf', size: '1.5 MB' },
        { format: 'Elite Guide', type: 'pdf', url: '/downloads/42km-elite-guide.pdf', size: '3.2 MB' }
      ]
    }
  };

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRace = params['race'] || '5km';
    });
  }

  selectRace(distance: string): void {
    this.selectedRace = distance;
  }

  get currentRoute(): RouteDetails {
    return this.routeDetails[this.selectedRace] || this.routeDetails['5km'];
  }

  getCurrentRoute(): RouteDetails {
    return this.routeDetails[this.selectedRace] || this.routeDetails['5km'];
  }

  downloadFile(type: string, url: string): void {
    // Simulate file download
    console.log(`Downloading ${type}...`);
    // In a real app, this would trigger actual download
    // window.open(url, '_blank');
  }

  openMap(): void {
    // Open full-screen map view
    const route = this.getCurrentRoute();
    console.log(`Opening map for ${route.name}`);
  }

  openFullMap(): void {
    // Open full-screen map view
    const route = this.getCurrentRoute();
    console.log(`Opening full map for ${route.name}`);
  }

  goBack(): void {
    this.router.navigate(['/race-info']);
  }

  getDirections(): void {
    const route = this.getCurrentRoute();
    const query = encodeURIComponent(`${route.startLocation} to ${route.endLocation}, Dar es Salaam`);
    window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
  }
} 