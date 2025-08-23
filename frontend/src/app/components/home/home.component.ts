import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RaceService, Race } from '../../services/race.service';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
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
  
  // Testimonials carousel
  currentTestimonialIndex: number = 0;
  autoScrollInterval: any;
  testimonials = [
    {
      id: 1,
      name: 'John Mwambene',
      title: 'Full Marathon Winner 2024',
      quote: 'The Nyerere Marathon is more than just a race. It\'s a celebration of our unity and determination. The organization was perfect and the support from the community was incredible.'
    },
    {
      id: 2,
      name: 'Sarah Kimaro',
      title: 'Half Marathon Participant',
      quote: 'This was my first marathon and I couldn\'t have chosen a better event. The route was beautiful and the volunteers were so supportive throughout the race.'
    },
    {
      id: 3,
      name: 'Michael Ndege',
      title: '10km Runner',
      quote: 'The atmosphere was electric! Running through Mbeya with thousands of people cheering was an experience I\'ll never forget. Can\'t wait for next year!'
    }
  ];

  constructor(
    private raceService: RaceService,
    private router: Router,
    private scrollAnimationService: ScrollAnimationService
  ) { }

  ngOnInit(): void {
    this.loadRaces();
    // Start auto-scroll after a short delay to ensure component is fully loaded
    setTimeout(() => {
      this.startAutoScroll();
    }, 1000);
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations after view is rendered
    setTimeout(() => {
      this.scrollAnimationService.initScrollAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    this.scrollAnimationService.destroy();
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

  // Testimonials carousel methods
  nextTestimonial(): void {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    console.log('Current testimonial index:', this.currentTestimonialIndex);
  }

  previousTestimonial(): void {
    this.currentTestimonialIndex = this.currentTestimonialIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentTestimonialIndex - 1;
    console.log('Current testimonial index:', this.currentTestimonialIndex);
  }

  goToTestimonial(index: number): void {
    this.currentTestimonialIndex = index;
    console.log('Current testimonial index:', this.currentTestimonialIndex);
  }

  startAutoScroll(): void {
    // Clear any existing interval first
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
    
    this.autoScrollInterval = setInterval(() => {
      console.log('Auto-scrolling to next testimonial...');
      this.nextTestimonial();
    }, 5000); // Auto-scroll every 5 seconds
  }

  pauseAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  resumeAutoScroll(): void {
    this.startAutoScroll();
  }

  formatQuote(quote: string): string[] {
    // Special handling for Michael Ndege's testimonial
    if (quote.includes('The atmosphere was electric! Running through Mbeya with thousands of people')) {
      return [
        '"The atmosphere was electric! Running through Mbeya with thousands of people',
        'cheering was an experience I\'ll never forget.',
        'Can\'t wait for next year!"'
      ];
    }
    
    // Split the quote into sentences and create paragraphs
    const sentences = quote.split('. ');
    const paragraphs = [];
    
    for (let i = 0; i < sentences.length; i++) {
      let sentence = sentences[i];
      if (i === 0) {
        sentence = '"' + sentence;
      }
      if (i === sentences.length - 1) {
        sentence = sentence + '"';
      } else {
        sentence = sentence + '.';
      }
      paragraphs.push(sentence);
    }
    
    return paragraphs;
  }
} 