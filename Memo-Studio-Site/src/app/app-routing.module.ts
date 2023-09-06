import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { LoginComponent } from './auth-user/authentication/login/login.component';
import { AuthGuard } from './shared/guards/auth-guard';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AuthenticationComponent } from './auth-user/authentication/authentication.component';
import { ForgottenPasswordComponent } from './auth-user/forgotten-password/forgotten-password.component';
import { SelfBookingComponent } from './self-booking/self-booking.component';

const routes: Routes = [  
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'self-booking', component: SelfBookingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AuthenticationComponent},
  { path: 'forgotten-password', component: ForgottenPasswordComponent},
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  { path: 'user/:id', component: UserDetailsComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'booking' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
