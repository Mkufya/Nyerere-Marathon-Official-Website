import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { NewsComponent } from './components/news/news.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';
import { RaceInfoComponent } from './components/race-info/race-info.component';
import { ContactComponent } from './components/contact/contact.component';
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
import { AdminLoginComponent } from './components/auth/admin-login/admin-login.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// News Components
import { PressReleasesComponent } from './components/news/press-releases/press-releases.component';
import { MediaGalleryComponent } from './components/news/media-gallery/media-gallery.component';
import { InterviewsComponent } from './components/news/interviews/interviews.component';
import { EventCoverageComponent } from './components/news/event-coverage/event-coverage.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/press-releases', component: PressReleasesComponent },
  { path: 'news/media-gallery', component: MediaGalleryComponent },
  { path: 'news/interviews', component: InterviewsComponent },
  { path: 'news/event-coverage', component: EventCoverageComponent },
  { path: 'sponsors', component: SponsorsComponent },
  { path: 'race-info', component: RaceInfoComponent },
  { path: 'race-info/kit', component: KitComponent },
  { path: 'race-info/route', component: RouteComponent },
  { path: 'race-info/prizes', component: PrizesComponent },
  { path: 'race-info/results', component: ResultsComponent },
  { path: 'payment-methods', component: PaymentMethodsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'races', component: RaceListComponent },
  { path: 'race/:id', component: RaceDetailComponent },
  { path: 'race/5km', component: Race5kmComponent },
  { path: 'race/10km', component: Race10kmComponent },
  { path: 'race/21km', component: Race21kmComponent },
  { path: 'race/42km', component: Race42kmComponent },
  { 
    path: 'register-race/:id', 
    component: RaceRegistrationComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'admin-login', component: AdminLoginComponent },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  // Redirect any unknown routes to home
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 