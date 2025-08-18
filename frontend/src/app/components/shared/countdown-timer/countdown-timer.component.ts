import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() targetDate: Date = new Date('2025-10-15');
  @Input() registeredUsers: number = 2450;
  @Input() countries: number = 42;
  
  weeks: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  
  private intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startCountdown(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const difference = target - now;

    if (difference > 0) {
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      
      this.weeks = Math.floor(totalDays / 7);
      this.days = totalDays % 7;
      this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
    } else {
      this.weeks = 0;
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
    }
  }

  get isExpired(): boolean {
    return this.weeks === 0 && this.days === 0 && this.hours === 0 && this.minutes === 0 && this.seconds === 0;
  }
} 