import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  fees: string;
  processingTime: string;
  supported: boolean;
  instructions: string[];
  requirements: string[];
}

interface PaymentCategory {
  title: string;
  methods: PaymentMethod[];
}

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  
  paymentCategories: PaymentCategory[] = [
    {
      title: 'Mobile Money',
      methods: [
        {
          id: 'mpesa',
          name: 'M-Pesa',
          icon: 'assets/images/payments/mpesa-logo.svg',
          description: 'Pay using M-Pesa mobile money service',
          fees: '2% + TSH 1,000',
          processingTime: 'Instant',
          supported: true,
          instructions: [
            'Go to M-Pesa menu on your phone',
            'Select "Pay Bill"',
            'Enter Business Number: 400200',
            'Enter Account Number: Your Registration ID',
            'Enter Amount',
            'Enter your M-Pesa PIN',
            'Confirm payment'
          ],
          requirements: [
            'Valid M-Pesa account',
            'Sufficient balance',
            'Registration ID from our system'
          ]
        },
        {
          id: 'tigopesa',
          name: 'Tigo Pesa',
          icon: 'assets/images/payments/tigo-pesa-logo.svg',
          description: 'Pay using Tigo Pesa mobile money service',
          fees: '2.5% + TSH 1,000',
          processingTime: 'Instant',
          supported: true,
          instructions: [
            'Dial *150*01# on your Tigo line',
            'Select "Pay Bills"',
            'Enter Business Number: 400200',
            'Enter Reference: Your Registration ID',
            'Enter Amount',
            'Enter your Tigo Pesa PIN',
            'Confirm payment'
          ],
          requirements: [
            'Valid Tigo Pesa account',
            'Sufficient balance',
            'Registration ID from our system'
          ]
        },
        {
          id: 'airtelmoney',
          name: 'Airtel Money',
          icon: 'assets/images/payments/airtel-money-logo.svg',
          description: 'Pay using Airtel Money mobile service',
          fees: '2% + TSH 1,000',
          processingTime: 'Instant',
          supported: true,
          instructions: [
            'Dial *150*60# on your Airtel line',
            'Select "Pay Bills"',
            'Enter Business Number: 400200',
            'Enter Account Number: Your Registration ID',
            'Enter Amount',
            'Enter your Airtel Money PIN',
            'Confirm payment'
          ],
          requirements: [
            'Valid Airtel Money account',
            'Sufficient balance',
            'Registration ID from our system'
          ]
        }
      ]
    },
    {
      title: 'Credit & Debit Cards',
      methods: [
        {
          id: 'visa',
          name: 'Visa',
          icon: 'assets/images/payments/visa-logo.svg',
          description: 'Pay securely with your Visa card',
          fees: '3.5% + TSH 500',
          processingTime: 'Instant',
          supported: true,
          instructions: [
            'Click "Pay with Card" button',
            'Enter your card details',
            'Enter your name as it appears on card',
            'Enter card number and expiry date',
            'Enter CVV (3 digits on back of card)',
            'Click "Pay Now"',
            'Complete 3D Secure verification if prompted'
          ],
          requirements: [
            'Valid Visa debit or credit card',
            'Sufficient funds or credit limit',
            'Card enabled for online transactions'
          ]
        },
        {
          id: 'mastercard',
          name: 'Mastercard',
          icon: 'assets/images/payments/mastercard-logo.svg',
          description: 'Pay securely with your Mastercard',
          fees: '3.5% + TSH 500',
          processingTime: 'Instant',
          supported: true,
          instructions: [
            'Click "Pay with Card" button',
            'Enter your card details',
            'Enter your name as it appears on card',
            'Enter card number and expiry date',
            'Enter CVV (3 digits on back of card)',
            'Click "Pay Now"',
            'Complete 3D Secure verification if prompted'
          ],
          requirements: [
            'Valid Mastercard debit or credit card',
            'Sufficient funds or credit limit',
            'Card enabled for online transactions'
          ]
        }
      ]
    },
    {
      title: 'Bank Transfer',
      methods: [
        {
          id: 'banktransfer',
          name: 'Bank Transfer',
          icon: 'assets/images/payments/bank-transfer-logo.svg',
          description: 'Direct bank transfer to our account',
          fees: 'Bank charges apply',
          processingTime: '1-3 business days',
          supported: true,
          instructions: [
            'Use the following bank details:',
            'Bank: CRDB Bank',
            'Account Name: Nyerere Marathon Ltd',
            'Account Number: 0150-359-875-00',
            'Branch: Dar es Salaam',
            'Swift Code: CORUTZTZ',
            'Reference: Your Registration ID + Full Name',
            'Send payment confirmation to finance@nyereremarathon.com'
          ],
          requirements: [
            'Valid bank account',
            'Registration ID from our system',
            'Payment confirmation email'
          ]
        }
      ]
    }
  ];

  selectedMethod: PaymentMethod | null = null;
  showInstructions: boolean = false;
  registrationId: string | null = null;
  raceId: string | null = null;
  amount: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Get registration ID and race information from route parameters
    this.registrationId = this.route.snapshot.queryParams['registrationId'];
    this.raceId = this.route.snapshot.queryParams['raceId'];
    this.amount = parseFloat(this.route.snapshot.queryParams['amount']) || 0;
    
    if (!this.registrationId) {
      this.snackBar.open('No registration found. Please complete registration first.', 'Close', { duration: 5000 });
      this.router.navigate(['/races']);
    }
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.showInstructions = true;
  }

  proceedWithPayment(method: PaymentMethod): void {
    if (!this.registrationId) {
      this.snackBar.open('Registration ID not found. Please try again.', 'Close', { duration: 5000 });
      return;
    }

    this.snackBar.open(`Proceeding with ${method.name} payment...`, 'Close', { duration: 3000 });
    
    switch (method.id) {
      case 'mpesa':
        this.processMobileMoneyPayment('mpesa', method);
        break;
      case 'tigopesa':
        this.processMobileMoneyPayment('tigopesa', method);
        break;
      case 'airtelmoney':
        this.processMobileMoneyPayment('airtelmoney', method);
        break;
      case 'visa':
      case 'mastercard':
        this.processCardPayment(method);
        break;
      case 'banktransfer':
        this.processBankTransfer(method);
        break;
      default:
        this.snackBar.open('Payment method not supported yet.', 'Close', { duration: 5000 });
    }
  }

  private processMobileMoneyPayment(provider: string, method: PaymentMethod): void {
    // Close the instructions modal
    this.closeInstructions();
    
    // Show processing message
    this.snackBar.open(`Complete payment using ${method.name} with the instructions provided.`, 'Got it', { 
      duration: 8000 
    });

         // For mobile money, we redirect to dashboard with success message
     // In a real implementation, this would redirect to a payment gateway
     setTimeout(() => {
       this.snackBar.open(
         `Please complete your ${method.name} payment using the instructions shown. Your registration will be confirmed once payment is received.`, 
         'Close', 
         { duration: 10000 }
       );
       this.router.navigate(['/dashboard']);
     }, 2000);
  }

     private processCardPayment(method: PaymentMethod): void {
     // Close the instructions modal
     this.closeInstructions();
     
     // For card payments, in a real implementation this would redirect to a secure payment gateway
     // For now, redirect to dashboard with instructions
     this.snackBar.open(
       `${method.name} payment processing is being set up. Please contact support for payment instructions.`, 
       'Close', 
       { duration: 8000 }
     );
     
     setTimeout(() => {
       this.router.navigate(['/dashboard']);
     }, 3000);
   }

     private processBankTransfer(method: PaymentMethod): void {
     // Close the instructions modal
     this.closeInstructions();
     
     // Show bank transfer confirmation
     this.snackBar.open(
       'Please complete the bank transfer using the provided details. Contact support with your payment confirmation.', 
       'Understood', 
       { duration: 10000 }
     );

     // Redirect to dashboard after showing instructions
     setTimeout(() => {
       this.router.navigate(['/dashboard']);
     }, 3000);
   }

  closeInstructions(): void {
    this.showInstructions = false;
    this.selectedMethod = null;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      // Show success message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
} 