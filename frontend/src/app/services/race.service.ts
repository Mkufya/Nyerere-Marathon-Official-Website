import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Race {
  _id?: string; // Database format
  id?: string;  // Temporary storage format
  name: string;
  distance: string;
  distanceKm?: number;
  description: string;
  startTime: string;
  endTime?: string;
  registrationFee: number;
  currency?: string;
  maxParticipants: number;
  currentParticipants: number;
  ageRestrictions?: {
    minAge: number;
    maxAge: number;
  };
  route?: {
    startPoint: {
      name: string;
      coordinates: { lat: number; lng: number; };
    };
    endPoint: {
      name: string;
      coordinates: { lat: number; lng: number; };
    };
    waypoints: Array<{
      name: string;
      coordinates: { lat: number; lng: number; };
      distanceFromStart: number;
    }>;
  };
  prizes?: {
    first?: { male: string; female: string; };
    second?: { male: string; female: string; };
    third?: { male: string; female: string; };
  };
  isActive: boolean;
  registrationOpen: boolean;
  registrationDeadline: string;
}

export interface RaceStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  pendingPayments: number;
  maleParticipants: number;
  femaleParticipants: number;
  availableSpots: number;
}

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRaces(): Observable<Race[]> {
    // For now, return mock data since backend API is not ready
    const mockRaces: Race[] = [
      {
        id: '1',
        name: 'Nyerere Marathon 2025',
        distance: '42km',
        distanceKm: 42,
        description: 'Full marathon through the heart of Tanzania',
        startTime: '2025-04-26T06:00:00Z',
        registrationFee: 50000,
        currency: 'TSh',
        maxParticipants: 1000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '2',
        name: 'Nyerere Half Marathon 2025',
        distance: '21km',
        distanceKm: 21,
        description: 'Half marathon for intermediate runners',
        startTime: '2025-04-26T07:00:00Z',
        registrationFee: 35000,
        currency: 'TSh',
        maxParticipants: 1500,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '3',
        name: 'Nyerere 10K Run 2025',
        distance: '10km',
        distanceKm: 10,
        description: '10K run for beginners and families',
        startTime: '2025-04-26T08:00:00Z',
        registrationFee: 25000,
        currency: 'TSh',
        maxParticipants: 2000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '4',
        name: 'Nyerere 5K Fun Run 2025',
        distance: '5km',
        distanceKm: 5,
        description: '5K fun run for everyone',
        startTime: '2025-04-26T09:00:00Z',
        registrationFee: 15000,
        currency: 'TSh',
        maxParticipants: 3000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      }
    ];
    
    return of(mockRaces).pipe(delay(500));
    
    // Uncomment when backend API is ready:
    // return this.http.get<any[]>(`${this.apiUrl}/races`).pipe(
    //   map(races => races.map(race => this.mapRaceData(race)))
    // );
  }

  getRace(id: string): Observable<Race> {
    // For now, return mock data since backend API is not ready
    const mockRaces: Race[] = [
      {
        id: '1',
        name: 'Nyerere Marathon 2025',
        distance: '42km',
        distanceKm: 42,
        description: 'Full marathon through the heart of Tanzania',
        startTime: '2025-04-26T06:00:00Z',
        registrationFee: 50000,
        currency: 'TSh',
        maxParticipants: 1000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '2',
        name: 'Nyerere Half Marathon 2025',
        distance: '21km',
        distanceKm: 21,
        description: 'Half marathon for intermediate runners',
        startTime: '2025-04-26T07:00:00Z',
        registrationFee: 35000,
        currency: 'TSh',
        maxParticipants: 1500,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '3',
        name: 'Nyerere 10K Run 2025',
        distance: '10km',
        distanceKm: 10,
        description: '10K run for beginners and families',
        startTime: '2025-04-26T08:00:00Z',
        registrationFee: 25000,
        currency: 'TSh',
        maxParticipants: 2000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      },
      {
        id: '4',
        name: 'Nyerere 5K Fun Run 2025',
        distance: '5km',
        distanceKm: 5,
        description: '5K fun run for everyone',
        startTime: '2025-04-26T09:00:00Z',
        registrationFee: 15000,
        currency: 'TSh',
        maxParticipants: 3000,
        currentParticipants: 0,
        isActive: true,
        registrationOpen: true,
        registrationDeadline: '2025-04-20T23:59:59Z'
      }
    ];
    
    const race = mockRaces.find(r => r.id === id || r._id === id);
    if (race) {
      return of(race).pipe(delay(300));
    } else {
      throw new Error('Race not found');
    }
    
    // Uncomment when backend API is ready:
    // return this.http.get<any>(`${this.apiUrl}/races/${id}`).pipe(
    //   map(race => this.mapRaceData(race))
    // );
  }

  private mapRaceData(race: any): Race {
    return {
      ...race,
      _id: race._id || race.id, // Handle both database and temporary storage IDs
      currency: race.currency || 'TSh',
      distanceKm: race.distanceKm || this.parseDistance(race.distance),
      currentParticipants: race.currentParticipants || 0,
      endTime: race.endTime || race.startTime,
      ageRestrictions: race.ageRestrictions || { minAge: 16, maxAge: 70 },
      route: race.route || {
        startPoint: { name: 'Start', coordinates: { lat: 0, lng: 0 } },
        endPoint: { name: 'Finish', coordinates: { lat: 0, lng: 0 } },
        waypoints: []
      },
      prizes: race.prizes || {
        first: { male: 'TSh ' + (race.prizes?.firstPlace || 0), female: 'TSh ' + (race.prizes?.firstPlace || 0) },
        second: { male: 'TSh ' + (race.prizes?.secondPlace || 0), female: 'TSh ' + (race.prizes?.secondPlace || 0) },
        third: { male: 'TSh ' + (race.prizes?.thirdPlace || 0), female: 'TSh ' + (race.prizes?.thirdPlace || 0) }
      }
    };
  }

  private parseDistance(distance: string): number {
    if (distance.includes('5K')) return 5;
    if (distance.includes('10K')) return 10;
    if (distance.includes('21K') || distance.includes('Half')) return 21;
    if (distance.includes('42K') || distance.includes('Full')) return 42;
    return 0;
  }

  getRaceStats(id: string): Observable<RaceStats> {
    return this.http.get<RaceStats>(`${this.apiUrl}/races/${id}/stats`);
  }
} 