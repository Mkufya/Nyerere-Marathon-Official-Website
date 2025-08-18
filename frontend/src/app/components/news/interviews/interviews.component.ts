import { Component, OnInit } from '@angular/core';

interface Interview {
  id: string;
  title: string;
  interviewee: string;
  role: string;
  date: Date;
  summary: string;
  videoUrl?: string;
  audioUrl?: string;
  transcriptUrl?: string;
  thumbnailUrl?: string;
  duration: string;
  category: string;
}

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent implements OnInit {

  interviews: Interview[] = [
    {
      id: '1',
      title: 'Marathon Champion Speaks About Victory',
      interviewee: 'John Mwangi',
      role: 'Marathon Winner 2024',
      date: new Date('2024-10-20'),
      summary: 'Exclusive interview with the 2024 marathon champion discussing his training, victory, and future plans.',
      videoUrl: 'assets/videos/interviews/champion-interview.mp4',
      thumbnailUrl: 'assets/images/interviews/champion-thumb.jpg',
      duration: '15:32',
      category: 'Athletes'
    },
    {
      id: '2',
      title: 'Event Director on Marathon Growth',
      interviewee: 'Sarah Kimani',
      role: 'Event Director',
      date: new Date('2024-10-18'),
      summary: 'Insight into the growth of Nyerere Marathon and plans for 2025.',
      audioUrl: 'assets/audio/interviews/director-interview.mp3',
      thumbnailUrl: 'assets/images/interviews/director-thumb.jpg',
      duration: '22:45',
      category: 'Organization'
    },
    {
      id: '3',
      title: 'Training Tips from Elite Runners',
      interviewee: 'Michael Kiprotich',
      role: 'Elite Runner',
      date: new Date('2024-10-15'),
      summary: 'Professional training advice for aspiring marathon runners.',
      videoUrl: 'assets/videos/interviews/training-tips.mp4',
      thumbnailUrl: 'assets/images/interviews/training-thumb.jpg',
      duration: '18:20',
      category: 'Training'
    }
  ];

  selectedCategory = 'All';
  categories = ['All', 'Athletes', 'Organization', 'Training', 'Community'];
  filteredInterviews: Interview[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredInterviews = this.interviews;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredInterviews = this.interviews;
    } else {
      this.filteredInterviews = this.interviews.filter(interview => interview.category === category);
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  playInterview(interview: Interview): void {
    console.log('Playing interview:', interview.title);
    // Implement media player functionality
  }

  downloadTranscript(interview: Interview): void {
    if (interview.transcriptUrl) {
      window.open(interview.transcriptUrl, '_blank');
    }
  }
} 