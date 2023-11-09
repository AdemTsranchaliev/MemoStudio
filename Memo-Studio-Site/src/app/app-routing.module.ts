import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookingComponent } from "./booking/booking.component";
import { LoginComponent } from "./auth-user/authentication/login/login.component";
import { AuthGuard } from "./shared/guards/auth-guard";
import { UserDetailsComponent } from "./shared/dialogs/user-details/user-details.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { AuthenticationComponent } from "./auth-user/authentication/authentication.component";
import { ForgottenPasswordComponent } from "./auth-user/forgotten-password/forgotten-password.component";
import { SelfBookingComponent } from "./self-booking/self-booking.component";
import { ProfileComponent } from "./profile/profile.component";
import { BookingConfirmationListComponent } from "./booking-confirmation-list/booking-confirmation-list.component";
import { EmailConfirmationComponent } from "./email-confirmation/email-confirmation.component";
import { HomeInfoComponent } from "./home-info/home-info.component";
import { ChangeForgottenPasswordComponent } from "./auth-user/change-forgotten-password/change-forgotten-password.component";
import { ViberConfirmationComponent } from "./shared/dialogs/viber-confirmation/viber-confirmation.component";
import { TermsConditionsComponent } from "./terms-conditions/terms-conditions.component";
import { CalendarOverviewComponent } from "./calendar/calendar-overview/calendar-overview.component";
import { ReservationCalendarComponent } from "./calendar/calendar.component";
import { SelfBookingRedisgnComponent } from "./self-booking-redisgn/self-booking-redisgn.component";

const routes: Routes = [
  {
    path: "self-booking-redisgn", component: SelfBookingRedisgnComponent, canActivate: [AuthGuard],
  },
  { path: "home-information", component: HomeInfoComponent },
  { path: "booking", component: BookingComponent, canActivate: [AuthGuard] },
  {
    path: "self-booking",
    component: SelfBookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "booking-confirmation-list",
    component: BookingConfirmationListComponent,
    canActivate: [AuthGuard],
  },
  { path: "viber-confirmation", component: ViberConfirmationComponent },
  { path: "login", component: AuthenticationComponent },
  { path: "forgotten-password", component: ForgottenPasswordComponent },
  { path: "users", component: UsersListComponent, canActivate: [AuthGuard] },
  { path: "email-confirm", component: EmailConfirmationComponent },
  { path: "change-password", component: ChangeForgottenPasswordComponent },
  {
    path: "user",
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: "terms-conditions", component: TermsConditionsComponent },
  { path: "test", component: CalendarOverviewComponent },
  { path: "calendar", component: ReservationCalendarComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "booking" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
