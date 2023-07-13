import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guards/auth-guard';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [  
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'users', component: UsersListComponent},
  { path: 'user/:id', component: UserDetailsComponent},
  { path: '**', redirectTo: 'booking' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
