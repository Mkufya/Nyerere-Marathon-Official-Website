import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaceService, Race } from '../../services/race.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  races: Race[] = [];
  raceDate: Date = new Date('2025-10-14');
  registeredUsers: number = 2450;
  countries: number = 42;
  activeTab: number = 0;
  tabs = [
    { title: 'Schedule', icon: 'schedule' },
    { title: 'Route Maps', icon: 'map' },
    { title: 'Race Categories', icon: 'emoji_events' }
  ];

  constructor(
    private raceService: RaceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRaces();
  }

  private loadRaces(): void {
    this.raceService.getRaces().subscribe({
      next: (races) => {
        this.races = races.slice(0, 4); // Show only first 4 races
      },
      error: (error) => {
        console.error('Error loading races:', error);
      }
    });
  }
} 