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
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { NewlyRegisteredEditComponent } from "./shared/components/admin/newly-registered/newly-registered-edit/newly-registered-edit.component";
import { NewlyRegisteredListComponent } from "./shared/components/admin/newly-registered/newly-registered-list/newly-registered-list.component";
import { CatchedErrorsListComponent } from "./shared/components/admin/catched-errors/catched-errors-list/catched-errors-list.component";
import { AllUsersListComponent } from "./shared/components/admin/all-users/all-users-list/all-users-list.component";
import { AllUsersEditComponent } from "./shared/components/admin/all-users/all-users-edit/all-users-edit.component";
import { UserHomeComponent } from "./user-home/user-home.component";
import { UpcomingBookingComponent } from "./shared/components/user/upcoming-booking/upcoming-booking.component";
import { PreBookingComponent } from "./shared/components/user/pre-booking/pre-booking.component";
import { BookServiceComponent } from "./shared/components/user/book-service/book-service.component";
import { FinishBussinesRegistrationComponent } from "./finish-bussines-registration/finish-bussines-registration.component";
// Update Calendar Beahaviour Via Animation
import { UserCalendarComponent } from "./shared/components/user/user-calendar/user-calendar.component";

const routes: Routes = [
  { path: "home-information", component: HomeInfoComponent },
  { path: "admin-dashboard", component: AdminDashboardComponent },
  { path: "newly-registered", component: NewlyRegisteredListComponent },
  {
    path: "newly-registered-details/:id",
    component: NewlyRegisteredEditComponent,
  },
  { path: "all-users", component: AllUsersListComponent },
  { path: "all-users/user-details/:id", component: AllUsersEditComponent },
  { path: "catched-errors", component: CatchedErrorsListComponent },
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
  { path: "user-home/:id", component: UserHomeComponent },
  { path: "user-calendar", component: UserCalendarComponent },
  { path: "upcoming", component: UpcomingBookingComponent },
  { path: "pre-booking", component: PreBookingComponent },
  { path: "book-service", component: BookServiceComponent },
  { path: "email-confirm", component: EmailConfirmationComponent },
  { path: "change-password", component: ChangeForgottenPasswordComponent },
  {
    path: "finish-registration",
    component: FinishBussinesRegistrationComponent,
  },
  {
    path: "user",
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: "terms-conditions", component: TermsConditionsComponent },
  { path: "calendar", component: ReservationCalendarComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "calendar" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
