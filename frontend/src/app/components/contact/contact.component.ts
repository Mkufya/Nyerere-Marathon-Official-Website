import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;

  contactInfo = {
    address: '123 Marathon Street, Dar es Salaam, Tanzania',
    phone: '+255 123 456 789',
    email: 'info@nyereremarathon.com',
    website: 'www.nyereremarathon.com'
  };

  socialMedia = [
    { platform: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/nyereremarathon' },
    { platform: 'Twitter', icon: 'fab fa-x-twitter', url: 'https://twitter.com/nyereremarathon' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/nyereremarathon' },
    { platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/nyereremarathon' }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', this.contactForm.value);
        this.isSubmitting = false;
        this.contactForm.reset();
        // Here you would typically send the form data to your backend
      }, 2000);
    }
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