import { Component, OnInit, Input } from '@angular/core';

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: CarouselImage[] = [];
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 5000;
  
  currentIndex: number = 0;
  private intervalId: any;

  constructor() { }

  ngOnInit(): void {
    // Default images if none provided
    if (this.images.length === 0) {
      this.images = [
        {
          src: 'https://via.placeholder.com/800x400/1976d2/ffffff?text=Start+Line',
          alt: 'Marathon Start Line',
          caption: 'Start Line - Where Dreams Begin'
        },
        {
          src: 'https://via.placeholder.com/800x400/2e7d32/ffffff?text=Finishers',
          alt: 'Marathon Finishers',
          caption: 'Finishers - Crossing the Line'
        },
        {
          src: 'https://via.placeholder.com/800x400/f57c00/ffffff?text=Crowd+Energy',
          alt: 'Crowd Energy',
          caption: 'Crowd Energy - Support that Drives Us'
        },
        {
          src: 'https://via.placeholder.com/800x400/7b1fa2/ffffff?text=Route+Scenery',
          alt: 'Route Scenery',
          caption: 'Route Scenery - Beautiful Dar es Salaam'
        },
        {
          src: 'https://via.placeholder.com/800x400/d32f2f/ffffff?text=Victory+Celebration',
          alt: 'Victory Celebration',
          caption: 'Victory Celebration - Champions Unite'
        }
      ];
    }
    
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  onMouseEnter(): void {
    if (this.autoSlide) {
      this.stopAutoSlide();
    }
  }

  onMouseLeave(): void {
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }
} 