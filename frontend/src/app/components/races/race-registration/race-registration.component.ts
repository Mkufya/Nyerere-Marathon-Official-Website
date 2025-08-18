import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipantService, RegistrationData } from '../../../services/participant.service';
import { RaceService, Race } from '../../../services/race.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-race-registration',
  templateUrl: './race-registration.component.html',
  styleUrls: ['./race-registration.component.scss']
})
export class RaceRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isSubmitting = false;
  race: Race | null = null;
  loading = true;

  tShirtSizes = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Double Extra Large (XXL)' }
  ];

  paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private participantService: ParticipantService,
    private raceService: RaceService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.formBuilder.group({
      tshirtSize: ['', Validators.required],
      dietaryRequirements: [''],
      estimatedFinishTime: [''],
      previousMarathonExperience: [false],
      paymentMethod: ['mpesa', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
      medicalConditions: [''],
      waiverAccepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    this.loadRaceDetails();
  }

  private loadRaceDetails(): void {
    const raceId = this.route.snapshot.paramMap.get('id');
    if (raceId) {
      this.raceService.getRace(raceId).subscribe({
        next: (race) => {
          this.race = race;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading race:', error);
          this.snackBar.open('Error loading race details', 'Close', { duration: 5000 });
          this.router.navigate(['/races']);
        }
      });
    } else {
      this.router.navigate(['/races']);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid && this.race) {
      this.isSubmitting = true;
      
      const registrationData: RegistrationData = {
        raceId: this.race?._id || this.race?.id || '',
        tshirtSize: this.registrationForm.value.tshirtSize,
        dietaryRequirements: this.registrationForm.value.dietaryRequirements,
        estimatedFinishTime: this.registrationForm.value.estimatedFinishTime,
        previousMarathonExperience: this.registrationForm.value.previousMarathonExperience,
        paymentMethod: this.registrationForm.value.paymentMethod,
        emergencyContactName: this.registrationForm.value.emergencyContactName,
        emergencyContactPhone: this.registrationForm.value.emergencyContactPhone,
        medicalConditions: this.registrationForm.value.medicalConditions,
        waiverAccepted: this.registrationForm.value.waiverAccepted
      };

      this.participantService.registerForRace(registrationData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.snackBar.open('Registration successful! Please proceed with payment.', 'Close', { duration: 3000 });
          
          // Redirect to payment methods page with registration details
          this.router.navigate(['/payment-methods'], {
            queryParams: {
              registrationId: response.registrationId || response.id,
              raceId: this.race?._id,
              amount: this.race?.registrationFee || 0,
              raceName: this.race?.name || 'Race'
            }
          });
        },
        error: (error) => {
          this.isSubmitting = false;
          const message = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('requiredTrue')) {
      return 'You must accept the waiver to proceed';
    }
    return '';
  }

  goBack(): void {
    if (this.race) {
      this.router.navigate(['/race', this.race._id]);
    } else {
      this.router.navigate(['/races']);
    }
  }
} 