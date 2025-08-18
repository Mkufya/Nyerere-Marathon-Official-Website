import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Race } from './race.service';

export interface Registration {
  _id?: string; // Database format
  id?: string;  // Temporary storage format
  participant: string;
  race: Race;
  bibNumber: string;
  registrationDate?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'mpesa' | 'card' | 'bank_transfer' | 'cash';
  transactionId?: string;
  amountPaid: number;
  tshirtSize: string;
  dietaryRequirements?: string;
  estimatedFinishTime?: string;
  previousMarathonExperience: boolean;
  waiver: {
    signed: boolean;
    signedDate?: string;
    ipAddress?: string;
  };
  checkedIn?: boolean;
  checkInTime?: string;
  status: 'registered' | 'confirmed' | 'checked_in' | 'started' | 'finished' | 'dnf' | 'cancelled';
  qrCode?: string;
  notes?: string;
}

export interface RegistrationData {
  raceId: string;
  tshirtSize: string;
  dietaryRequirements?: string;
  estimatedFinishTime?: string;
  previousMarathonExperience: boolean;
  paymentMethod: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  waiverAccepted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registerForRace(registrationData: RegistrationData): Observable<any> {
    return this.http.post(`${this.apiUrl}/participants/register`, registrationData);
  }

  getMyRegistrations(): Observable<Registration[]> {
    // For now, return empty array since no registrations exist yet
    // This will be replaced with actual API call when backend is ready
    return of([]).pipe(delay(500));
    
    // Uncomment when backend API is ready:
    // return this.http.get<Registration[]>(`${this.apiUrl}/participants/my-registrations`);
  }

  getRegistration(id: string): Observable<Registration> {
    return this.http.get<Registration>(`${this.apiUrl}/participants/registration/${id}`);
  }
} 