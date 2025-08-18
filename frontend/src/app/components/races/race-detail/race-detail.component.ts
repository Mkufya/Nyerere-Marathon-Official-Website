import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RaceService, Race, RaceStats } from '../../../services/race.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-race-detail',
  template: `
    <div class="container mt-4" *ngIf="race">
      <div class="row">
        <div class="col-12">
          <button mat-button routerLink="/races" class="mb-3">
            <mat-icon>arrow_back</mat-icon>
            Back to Races
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <mat-card class="race-header">
            <mat-card-content>
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h1>{{race.name}}</h1>
                  <h2 class="distance">{{race.distance}}</h2>
                  <p class="lead">{{race.description}}</p>
                </div>
                <div class="text-end">
                  <h3 class="price">{{race.registrationFee | currency:race.currency:'symbol':'1.0-0'}}</h3>
                  <small class="text-muted">Registration Fee</small>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Race Information -->
          <mat-card class="mt-4">
            <mat-card-header>
              <mat-card-title>Race Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-section">
                    <h5>Event Details</h5>
                    <div class="info-item">
                      <mat-icon>schedule</mat-icon>
                      <div>
                        <strong>Start Time:</strong><br>
                        {{race.startTime | date:'fullDate'}}<br>
                        {{race.startTime | date:'shortTime'}}
                      </div>
                    </div>
                    <div class="info-item">
                      <mat-icon>timer</mat-icon>
                      <div>
                        <strong>End Time:</strong><br>
                        {{race.endTime | date:'fullDate'}}<br>
                        {{race.endTime | date:'shortTime'}}
                      </div>
                    </div>
                    <div class="info-item">
                      <mat-icon>straighten</mat-icon>
                      <div>
                        <strong>Distance:</strong><br>
                        {{race.distanceKm}} kilometers
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="info-section">
                    <h5>Registration</h5>
                    <div class="info-item">
                      <mat-icon>event_available</mat-icon>
                      <div>
                        <strong>Registration Deadline:</strong><br>
                        {{race.registrationDeadline | date:'fullDate'}}
                      </div>
                    </div>
                    <div class="info-item">
                      <mat-icon>groups</mat-icon>
                      <div>
                        <strong>Participants:</strong><br>
                        {{race.currentParticipants}} / {{race.maxParticipants}}
                      </div>
                    </div>
                    <div class="info-item">
                      <mat-icon>person</mat-icon>
                      <div>
                        <strong>Age Limit:</strong><br>
                        {{race.ageRestrictions?.minAge}} - {{race.ageRestrictions?.maxAge}} years
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <mat-card class="registration-card">
            <mat-card-header>
              <mat-card-title>Registration</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="registration-status mb-3">
                <mat-chip [color]="getStatusColor()" selected>
                  {{getStatusText()}}
                </mat-chip>
              </div>

              <div class="registration-progress mb-3">
                <div class="d-flex justify-content-between mb-2">
                  <small>Registration Progress</small>
                  <small>{{getRegistrationPercentage()}}%</small>
                </div>
                <mat-progress-bar 
                  mode="determinate" 
                  [value]="getRegistrationPercentage()"
                  [color]="getProgressColor()">
                </mat-progress-bar>
              </div>

              <div class="price-display mb-3">
                <h3>{{race.registrationFee | currency:race.currency:'symbol':'1.0-0'}}</h3>
                <small class="text-muted">Registration Fee</small>
              </div>

              <button mat-raised-button 
                      color="primary" 
                      class="w-100 mb-3"
                      [routerLink]="['/register-race', race._id]"
                      [disabled]="!canRegister()"
                      *ngIf="isAuthenticated">
                Register Now
              </button>
              
              <button mat-raised-button 
                      color="primary" 
                      class="w-100 mb-3"
                      routerLink="/login"
                      *ngIf="!isAuthenticated">
                Login to Register
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div class="container mt-4" *ngIf="!race && loading">
      <div class="text-center py-5">
        <mat-spinner></mat-spinner>
        <p class="mt-3">Loading race details...</p>
      </div>
    </div>
  `,
  styles: [`
    .race-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
    }
    
    .distance {
      color: #bbdefb;
      font-weight: 300;
    }
    
    .price {
      color: #fff;
      font-weight: bold;
      margin: 0;
    }
    
    .info-section {
      margin-bottom: 24px;
    }
    
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .info-item mat-icon {
      color: #1976d2;
      margin-top: 2px;
    }
    
    .registration-card {
      position: sticky;
      top: 20px;
    }
    
    .price-display h3 {
      color: #1976d2;
      margin: 0;
    }
    
    .w-100 {
      width: 100%;
    }
  `]
})
export class RaceDetailComponent implements OnInit {
  race: Race | null = null;
  stats: RaceStats | null = null;
  loading = true;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private raceService: RaceService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadRaceDetails();
  }

  private checkAuthentication(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  private loadRaceDetails(): void {
    const raceId = this.route.snapshot.paramMap.get('id');
    if (raceId) {
      this.raceService.getRace(raceId).subscribe({
        next: (race) => {
          this.race = race;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading race:', error);
          this.loading = false;
        }
      });
    }
  }

  canRegister(): boolean {
    if (!this.race) return false;
    const now = new Date();
    const registrationDeadline = new Date(this.race.registrationDeadline);
    return this.race.registrationOpen && 
           now < registrationDeadline && 
           this.race.currentParticipants < this.race.maxParticipants;
  }

  getStatusText(): string {
    if (!this.race) return '';
    if (!this.race.registrationOpen) return 'Registration Closed';
    if (this.race.currentParticipants >= this.race.maxParticipants) return 'Sold Out';
    if (new Date() > new Date(this.race.registrationDeadline)) return 'Registration Ended';
    return 'Open for Registration';
  }

  getStatusColor(): 'primary' | 'accent' | 'warn' {
    if (this.canRegister()) return 'primary';
    if (this.race && this.race.currentParticipants >= this.race.maxParticipants) return 'warn';
    return 'accent';
  }

  getRegistrationPercentage(): number {
    if (!this.race) return 0;
    return Math.round((this.race.currentParticipants / this.race.maxParticipants) * 100);
  }

  getProgressColor(): 'primary' | 'accent' | 'warn' {
    const percentage = this.getRegistrationPercentage();
    if (percentage < 50) return 'primary';
    if (percentage < 80) return 'accent';
    return 'warn';
  }
} 