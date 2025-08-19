import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface RaceType {
  id: string;
  name: string;
  distance: string;
  description: string;
  difficulty: string;
  price: string;
  priceUSD: string;
  startTime: string;
  icon: string;
  gradient: string;
  route: string;
  participants: number;
  maxParticipants: number;
}

@Component({
  selector: 'app-race-list',
  template: `
    <div class="races-container">
      <!-- Hero Section -->
      <section class="races-hero">
        <div class="hero-content">
          <h1>Choose Your Challenge</h1>
          <p class="lead">Select your race distance and embark on an unforgettable journey at the Nyerere Marathon 2025</p>
        </div>
      </section>

      <!-- Race Selection -->
      <section class="race-selection">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 col-md-6 mb-4" *ngFor="let race of raceTypes">
              <div class="race-card" 
                   [style.background]="race.gradient"
                   (click)="selectRace(race)">
                <div class="race-card-content">
                  <div class="race-icon">
                    <mat-icon>{{ race.icon }}</mat-icon>
                  </div>
                  
                  <div class="race-info">
                    <h2>{{ race.name }}</h2>
                    <p class="distance">{{ race.distance }}</p>
                    <p class="description">{{ race.description }}</p>
                    
                    <div class="race-details">
                      <div class="detail-item">
                        <mat-icon>schedule</mat-icon>
                        <span>{{ race.startTime }}</span>
                      </div>
                      <div class="detail-item">
                        <mat-icon>trending_up</mat-icon>
                        <span>{{ race.difficulty }}</span>
                      </div>
                      <div class="detail-item">
                        <mat-icon>payments</mat-icon>
                        <span>{{ race.price }}</span>
                      </div>
                    </div>
                    
                    <div class="registration-info">
                      <div class="participants">
                        <span class="current">{{ race.participants }}</span>
                        <span class="separator">/</span>
                        <span class="max">{{ race.maxParticipants }}</span>
                        <span class="label">registered</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" 
                             [style.width.%]="getRegistrationPercentage(race)">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="race-actions">
                    <button mat-raised-button 
                            color="primary" 
                            class="select-btn"
                            (click)="selectRace(race); $event.stopPropagation()">
                      <mat-icon>person_add</mat-icon>
                      Register Now
                    </button>
                  </div>
                </div>
                
                <div class="race-card-overlay">
                  <div class="overlay-content">
                    <h3>Ready to Register?</h3>
                    <p>Click to start your registration for this race</p>
                    <mat-icon>directions_run</mat-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Race Features -->
      <section class="race-features">
        <div class="container">
          <h2 class="section-title">Why Choose Nyerere Marathon?</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="feature-card">
                <mat-icon>emoji_events</mat-icon>
                <h3>IAAF Certified</h3>
                <p>Official certification for marathon record attempts and Boston qualifying times</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card">
                <mat-icon>local_hospital</mat-icon>
                <h3>Medical Support</h3>
                <p>Comprehensive medical coverage with stations every 5KM and emergency response teams</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card">
                <mat-icon>card_giftcard</mat-icon>
                <h3>Premium Race Kit</h3>
                <p>High-quality race materials including technical shirts, medals, and recovery packages</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .races-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .races-hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .races-hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .hero-content .lead {
      font-size: 1.3rem;
      opacity: 0.9;
      line-height: 1.6;
    }
    
    .race-selection {
      padding: 80px 0;
    }
    
    .race-card {
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      min-height: 500px;
      display: flex;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .race-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .race-card:hover .race-card-overlay {
      opacity: 1;
    }
    
    .race-card-content {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      width: 100%;
    }
    
    .race-icon {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .race-icon mat-icon {
      font-size: 4rem;
      color: rgba(255,255,255,0.9);
    }
    
    .race-info h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .race-info .distance {
      font-size: 1.2rem;
      margin-bottom: 20px;
      opacity: 0.9;
      font-weight: 300;
    }
    
    .race-info .description {
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    
    .race-details {
      margin-bottom: 30px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 1rem;
    }
    
    .detail-item mat-icon {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    
    .registration-info {
      margin-bottom: 30px;
    }
    
    .participants {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 10px;
      font-size: 1rem;
    }
    
    .participants .current {
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    .participants .max {
      opacity: 0.8;
    }
    
    .participants .label {
      opacity: 0.7;
      font-size: 0.9rem;
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255,255,255,0.3);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: rgba(255,255,255,0.8);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    
    .race-actions {
      margin-top: auto;
    }
    
    .select-btn {
      padding: 12px 30px;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 25px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .select-btn:hover {
      background: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.5);
    }
    
    .race-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 3;
    }
    
    .overlay-content {
      text-align: center;
      color: white;
    }
    
    .overlay-content h3 {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    
    .overlay-content p {
      font-size: 1.1rem;
      margin-bottom: 20px;
      opacity: 0.9;
    }
    
    .overlay-content mat-icon {
      font-size: 3rem;
      opacity: 0.7;
    }
    
    .race-features {
      padding: 80px 0;
      background: white;
    }
    
    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 60px;
      color: #333;
    }
    
    .feature-card {
      text-align: center;
      padding: 40px 20px;
      border-radius: 15px;
      background: #f8f9fa;
      transition: all 0.3s ease;
      height: 100%;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .feature-card mat-icon {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 20px;
    }
    
    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: #333;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.5;
      margin: 0;
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5rem;
      }
      
      .race-info h2 {
        font-size: 2rem;
      }
      
      .race-card {
        min-height: 400px;
      }
      
      .race-card-content {
        padding: 30px;
      }
    }
  `]
})
export class RaceListComponent implements OnInit {
  raceTypes: RaceType[] = [
    {
      id: '4',
      name: '5KM Fun Run',
      distance: '5 Kilometers',
      description: 'Perfect for beginners and families! A supportive and energetic atmosphere for all fitness levels.',
      difficulty: 'Beginner',
      price: '30,000 TZS',
      priceUSD: '$15 USD',
      startTime: '8:00 AM',
      icon: 'directions_walk',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/race/4',
      participants: 1247,
      maxParticipants: 2000
    },
    {
      id: '3',
      name: '10KM Challenge',
      distance: '10 Kilometers',
      description: 'Step up your game! Perfect for recreational runners looking to push their limits.',
      difficulty: 'Intermediate',
      price: '30,000 TZS',
      priceUSD: '$25 USD',
      startTime: '7:30 AM',
      icon: 'directions_run',
      gradient: 'linear-gradient(135deg, #ff8c00 0%, #ff4500 100%)',
      route: '/race/3',
      participants: 856,
      maxParticipants: 1500
    },
    {
      id: '2',
      name: '21KM Half Marathon',
      distance: '21.1 Kilometers',
      description: 'The ultimate endurance challenge! Attracts serious runners from across East Africa.',
      difficulty: 'Advanced',
      price: '30,000 TZS',
      priceUSD: '$40 USD',
      startTime: '6:30 AM',
      icon: 'fitness_center',
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      route: '/race/2',
      participants: 423,
      maxParticipants: 1000
    },
    {
      id: '1',
      name: '42KM Full Marathon',
      distance: '42.2 Kilometers',
      description: 'The ultimate test of endurance! Elite athletes from around the world compete in this prestigious event.',
      difficulty: 'Elite',
      price: '30,000 TZS',
      priceUSD: '$60 USD',
      startTime: '6:00 AM',
      icon: 'emoji_events',
      gradient: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
      route: '/race/1',
      participants: 156,
      maxParticipants: 500
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Component initialization
  }

  selectRace(race: RaceType): void {
    console.log('🏃 Navigating to race details:', race.id);
    this.router.navigate(['/race', race.id]);
  }

  getRegistrationPercentage(race: RaceType): number {
    return Math.round((race.participants / race.maxParticipants) * 100);
  }
} 