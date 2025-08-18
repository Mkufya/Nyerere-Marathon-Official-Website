import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ParticipantService, Registration } from '../../services/participant.service';
import { RaceService, Race } from '../../services/race.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1>Welcome back, {{currentUser?.firstName}}!</h1>
          <p class="lead">Manage your race registrations and view upcoming events.</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-3 col-6">
          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="stat-icon">directions_run</mat-icon>
              <h3>{{myRegistrations.length}}</h3>
              <p>My Registrations</p>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-3 col-6">
          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="stat-icon">schedule</mat-icon>
              <h3>{{upcomingRaces.length}}</h3>
              <p>Upcoming Races</p>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-3 col-6">
          <mat-card class="stat-card">
            <mat-card-content class="text-center">
              <mat-icon class="stat-icon">check_circle</mat-icon>
              <h3>{{confirmedRegistrations}}</h3>
              <p>Confirmed</p>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-3 col-6">
          <mat-card class="stat-card" [class.pending-highlight]="pendingRegistrations > 0">
            <mat-card-content class="text-center">
              <mat-icon class="stat-icon">pending</mat-icon>
              <h3>{{pendingRegistrations}}</h3>
              <p>Pending Payment</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Pending Payments Alert -->
      <div class="row mb-4" *ngIf="pendingRegistrations > 0">
        <div class="col-12">
          <mat-card class="alert-card pending-alert">
            <mat-card-content class="d-flex align-items-center">
              <mat-icon class="alert-icon">warning</mat-icon>
              <div class="flex-grow-1">
                <h4>Complete Your Payment</h4>
                <p>You have {{pendingRegistrations}} registration(s) with pending payment. Complete your payment to confirm your participation.</p>
              </div>
              <button mat-raised-button color="warn" (click)="scrollToRegistrations()">
                View Pending
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="row">
        <!-- My Registrations -->
        <div class="col-lg-8">
          <mat-card #registrationsCard>
            <mat-card-header>
              <mat-card-title>My Race Registrations</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="myRegistrations.length === 0" class="text-center py-4">
                <mat-icon class="empty-icon">sentiment_neutral</mat-icon>
                <p>You haven't registered for any races yet.</p>
                <button mat-raised-button color="primary" routerLink="/races">
                  Browse Races
                </button>
              </div>

              <div *ngFor="let registration of myRegistrations" class="registration-card mb-3" [class.pending-registration]="registration.paymentStatus === 'pending'">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h4>{{registration.race.name}}</h4>
                    <p class="text-muted">{{registration.race.distance}} • {{registration.race.startTime | date:'fullDate'}}</p>
                    <div class="registration-details">
                      <span class="badge" [class]="getStatusClass(registration.paymentStatus)">
                        {{registration.paymentStatus | titlecase}}
                      </span>
                      <span class="mx-2">Bib: {{registration.bibNumber}}</span>
                      <span class="mx-2">T-Shirt: {{registration.tshirtSize}}</span>
                    </div>
                  </div>
                  <div class="text-end">
                    <p class="mb-2"><strong>{{registration.amountPaid | currency:'TZS':'symbol':'1.0-0'}}</strong></p>
                    <div class="button-group">
                      <button mat-button color="primary" [routerLink]="['/registration', registration._id]">
                        View Details
                      </button>
                      <button mat-raised-button color="warn" *ngIf="registration.paymentStatus === 'pending'" (click)="completePayment(registration)">
                        <mat-icon>payment</mat-icon>
                        Complete Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Upcoming Races -->
        <div class="col-lg-4">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Upcoming Races</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="upcomingRaces.length === 0" class="text-center py-4">
                <p>No upcoming races available.</p>
              </div>

              <div *ngFor="let race of upcomingRaces" class="race-card mb-3">
                <h5>{{race.name}}</h5>
                <p class="text-muted">{{race.distance}}</p>
                <p class="text-muted">{{race.startTime | date:'shortDate'}}</p>
                <p class="mb-2"><strong>{{race.registrationFee | currency:race.currency:'symbol':'1.0-0'}}</strong></p>
                <button mat-button color="primary" [routerLink]="['/race', race._id]">
                  View Race
                </button>
              </div>

              <div class="text-center mt-3">
                <button mat-raised-button color="primary" routerLink="/races">
                  View All Races
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      margin-bottom: 20px;
      transition: transform 0.2s ease-in-out;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .stat-card.pending-highlight {
      border: 2px solid #ff9800;
      background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
    }
    
    .stat-icon {
      font-size: 3rem;
      color: #1976d2;
      margin-bottom: 8px;
    }
    
    .stat-card h3 {
      font-size: 2rem;
      margin: 8px 0;
      color: #1976d2;
    }
    
    .empty-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 16px;
    }
    
    .alert-card {
      border-left: 4px solid #ff9800;
      background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
    }
    
    .alert-icon {
      color: #ff9800;
      font-size: 2rem;
      margin-right: 16px;
    }
    
    .alert-card h4 {
      color: #e65100;
      margin: 0 0 8px 0;
    }
    
    .alert-card p {
      margin: 0;
      color: #bf360c;
    }
    
    .registration-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      background-color: #fafafa;
      transition: all 0.3s ease;
    }
    
    .registration-card.pending-registration {
      border-left: 4px solid #ff9800;
      background: linear-gradient(135deg, #fff9c4 0%, #fff3e0 100%);
    }
    
    .registration-details {
      margin-top: 8px;
    }
    
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .badge.completed {
      background-color: #c8e6c9;
      color: #2e7d32;
    }
    
    .badge.pending {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .badge.failed {
      background-color: #ffcdd2;
      color: #d32f2f;
    }
    
    .button-group {
      display: flex;
      gap: 8px;
      flex-direction: column;
    }
    
    .button-group button {
      white-space: nowrap;
    }
    
    .race-card {
      border-left: 4px solid #1976d2;
      padding-left: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .race-card:last-child {
      border-bottom: none;
    }
    
    .flex-grow-1 {
      flex-grow: 1;
    }
    
    .d-flex {
      display: flex;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .text-center {
      text-align: center;
    }
    
    .text-end {
      text-align: end;
    }
    
    .mb-2 {
      margin-bottom: 8px;
    }
    
    .mb-3 {
      margin-bottom: 16px;
    }
    
    .mb-4 {
      margin-bottom: 24px;
    }
    
    .mt-3 {
      margin-top: 16px;
    }
    
    .mt-4 {
      margin-top: 24px;
    }
    
    .mx-2 {
      margin-left: 8px;
      margin-right: 8px;
    }
    
    .py-4 {
      padding-top: 24px;
      padding-bottom: 24px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild('registrationsCard', { static: false }) registrationsCard!: ElementRef;
  
  currentUser: User | null = null;
  myRegistrations: Registration[] = [];
  upcomingRaces: Race[] = [];
  confirmedRegistrations = 0;
  pendingRegistrations = 0;

  constructor(
    private authService: AuthService,
    private participantService: ParticipantService,
    private raceService: RaceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadRegistrations();
    this.loadUpcomingRaces();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadRegistrations(): void {
    this.participantService.getMyRegistrations().subscribe({
      next: (registrations) => {
        this.myRegistrations = registrations;
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading registrations:', error);
      }
    });
  }

  private loadUpcomingRaces(): void {
    this.raceService.getRaces().subscribe({
      next: (races) => {
        const now = new Date();
        this.upcomingRaces = races
          .filter(race => new Date(race.startTime) > now && race.registrationOpen)
          .slice(0, 3); // Show only next 3 races
      },
      error: (error) => {
        console.error('Error loading races:', error);
      }
    });
  }

  private calculateStats(): void {
    this.confirmedRegistrations = this.myRegistrations.filter(r => r.paymentStatus === 'completed').length;
    this.pendingRegistrations = this.myRegistrations.filter(r => r.paymentStatus === 'pending').length;
  }

  getStatusClass(status: string): string {
    return `badge ${status}`;
  }

  completePayment(registration: Registration): void {
    // Handle both database format (_id) and temporary storage format (id)
    const registrationId = registration._id || (registration as any).id;
    const raceId = registration.race._id || (registration.race as any).id;
    const raceName = registration.race.name;
    const amount = registration.amountPaid || registration.race.registrationFee;

    if (!registrationId) {
      console.error('No registration ID found:', registration);
      return;
    }

    this.router.navigate(['/payment-methods'], {
      queryParams: {
        registrationId: registrationId,
        raceId: raceId,
        amount: amount,
        raceName: raceName
      }
    });
  }

  scrollToRegistrations(): void {
    this.registrationsCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
} 