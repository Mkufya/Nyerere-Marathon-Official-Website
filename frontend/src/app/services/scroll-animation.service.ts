import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer: IntersectionObserver | null = null;
  private animatedElements = new Set<Element>();

  constructor() {
    this.initObserver();
  }

  private initObserver(): void {
    // Check if browser supports IntersectionObserver
    if (!window.IntersectionObserver) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            // Add animation class when element enters viewport
            entry.target.classList.add('in-view');
            this.animatedElements.add(entry.target);
            
            // Optional: Unobserve after animation to improve performance
            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element enters viewport
      }
    );
  }

  /**
   * Observe an element for scroll animations
   */
  observeElement(element: ElementRef | Element): void {
    if (!this.observer) return;

    const targetElement = element instanceof ElementRef ? element.nativeElement : element;
    
    // Add base animation class
    targetElement.classList.add('animate-on-scroll');
    
    // Start observing
    this.observer.observe(targetElement);
  }

  /**
   * Observe multiple elements at once
   */
  observeElements(elements: (ElementRef | Element)[]): void {
    elements.forEach(element => {
      this.observeElement(element);
    });
  }

  /**
   * Stop observing an element
   */
  unobserveElement(element: ElementRef | Element): void {
    if (!this.observer) return;

    const targetElement = element instanceof ElementRef ? element.nativeElement : element;
    this.observer.unobserve(targetElement);
    this.animatedElements.delete(targetElement);
  }

  /**
   * Cleanup observer
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.animatedElements.clear();
  }

  /**
   * Initialize scroll animations for elements with specific selectors
   */
  initScrollAnimations(): void {
    if (!this.observer) return;

    // Find all elements with scroll animation classes
    const animationSelectors = [
      '.animate-on-scroll',
      '.animate-fade-in',
      '.animate-slide-up',
      '.animate-slide-in-left',
      '.animate-slide-in-right',
      '.text-reveal'
    ];

    animationSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (!this.animatedElements.has(element)) {
          this.observer!.observe(element);
        }
      });
    });
  }
}



