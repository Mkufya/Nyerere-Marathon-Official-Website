import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NewsComponent } from './components/news/news.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { RaceInfoComponent } from './components/race-info/race-info.component';
import { ContactComponent } from './components/contact/contact.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CountdownTimerComponent } from './components/shared/countdown-timer/countdown-timer.component';
import { ImageCarouselComponent } from './components/shared/image-carousel/image-carousel.component';
import { LanguageSwitcherComponent } from './components/shared/language-switcher/language-switcher.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmailVerificationComponent } from './components/auth/email-verification/email-verification.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RaceListComponent } from './components/races/race-list/race-list.component';
import { RaceDetailComponent } from './components/races/race-detail/race-detail.component';
import { Race5kmComponent } from './components/races/race-5km/race-5km.component';
import { Race10kmComponent } from './components/races/race-10km/race-10km.component';
import { Race21kmComponent } from './components/races/race-21km/race-21km.component';
import { Race42kmComponent } from './components/races/race-42km/race-42km.component';
import { RaceRegistrationComponent } from './components/races/race-registration/race-registration.component';
import { KitComponent } from './components/race-info/kit/kit.component';
import { RouteComponent } from './components/race-info/route/route.component';
import { PrizesComponent } from './components/race-info/prizes/prizes.component';
import { ResultsComponent } from './components/race-info/results/results.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';


// Services
import { AuthService } from './services/auth.service';
import { RaceService } from './services/race.service';
import { ParticipantService } from './services/participant.service';
import { TranslationService } from './services/translation.service';

// Interceptors
import { AuthInterceptor } from './services/auth.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';

import { PressReleasesComponent } from './components/news/press-releases/press-releases.component';
import { MediaGalleryComponent } from './components/news/media-gallery/media-gallery.component';
import { InterviewsComponent } from './components/news/interviews/interviews.component';
import { EventCoverageComponent } from './components/news/event-coverage/event-coverage.component';
import { AdminLoginComponent } from './components/auth/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NewsComponent,
    SponsorsComponent,
    RaceInfoComponent,
    ContactComponent,
    NavbarComponent,
    FooterComponent,
    CountdownTimerComponent,
    ImageCarouselComponent,
    LanguageSwitcherComponent,
    LoginComponent,
    RegisterComponent,
    EmailVerificationComponent,
    DashboardComponent,
    RaceListComponent,
    RaceDetailComponent,
    Race5kmComponent,
    Race10kmComponent,
    Race21kmComponent,
    Race42kmComponent,
    RaceRegistrationComponent,
    KitComponent,
    RouteComponent,
    PrizesComponent,
    ResultsComponent,
    PaymentMethodsComponent,
    PressReleasesComponent,
    MediaGalleryComponent,
    InterviewsComponent,
    EventCoverageComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatDividerModule,
    MatTooltipModule
  ],
  providers: [
    AuthService,
    RaceService,
    ParticipantService,
    TranslationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 