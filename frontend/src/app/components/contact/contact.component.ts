import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollAnimationService } from '../../services/scroll-animation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;

  contactInfo = {
    address: 'Mikocheni, Dar es Salaam, Tanzania',
    phone: '+255 754 778 868',
    email: 'info@nyereremarathon.com',
    website: 'www.nyereremarathon.co.tz'
  };

  socialMedia = [
    { platform: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/nyereremarathon' },
    { platform: 'Twitter', icon: 'fab fa-x-twitter', url: 'https://twitter.com/nyereremarathon' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/nyereremarathon' },
    { platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/nyereremarathon' }
  ];

  constructor(
    private fb: FormBuilder,
    private scrollAnimationService: ScrollAnimationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Initialize form without showing errors
    this.contactForm.markAsUntouched();
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

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', this.contactForm.value);
        this.isSubmitting = false;
        this.contactForm.reset();
        this.contactForm.markAsUntouched(); // Reset touched state
        // Here you would typically send the form data to your backend
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // Check if field should show error
  shouldShowError(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return control ? (control.invalid && control.touched) : false;
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${minLength} characters long`;
    }
    return '';
  }
} 