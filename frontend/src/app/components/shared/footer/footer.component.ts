import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  newsletterForm: FormGroup;
  isSubmitting = false;
  subscriptionMessage = '';

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.newsletterForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.subscriptionMessage = 'Thank you for subscribing to our newsletter!';
        this.newsletterForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.subscriptionMessage = '';
        }, 5000);
      }, 2000);
    }
  }
} 