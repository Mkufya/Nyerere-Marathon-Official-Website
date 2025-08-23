import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

export interface PrizeMoney {
  category: string;
  first: string;
  second: string;
  third: string;
}

@Component({
  selector: 'app-race-info',
  templateUrl: './race-info.component.html',
  styleUrls: ['./race-info.component.scss']
})
export class RaceInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  prizeMoneyData: PrizeMoney[] = [];

  constructor(private scrollAnimationService: ScrollAnimationService) { }

  ngOnInit(): void {
    this.loadPrizeMoneyData();
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations after view is rendered
    setTimeout(() => {
      this.scrollAnimationService.initScrollAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    this.scrollAnimationService.destroy();
  }

  private loadPrizeMoneyData(): void {
    this.prizeMoneyData = [
      { category: 'Men\'s Marathon', first: '$10,000', second: '$5,000', third: '$2,500' },
      { category: 'Women\'s Marathon', first: '$10,000', second: '$5,000', third: '$2,500' },
      { category: 'Men\'s Half Marathon', first: '$3,000', second: '$1,500', third: '$750' },
      { category: 'Women\'s Half Marathon', first: '$3,000', second: '$1,500', third: '$750' },
      { category: '10K Men', first: '$1,000', second: '$500', third: '$250' },
      { category: '10K Women', first: '$1,000', second: '$500', third: '$250' }
    ];
  }
} 