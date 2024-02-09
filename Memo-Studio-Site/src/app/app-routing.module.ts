import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./shared/guards/auth-guard";
import { UserDetailsComponent } from "./shared/dialogs/user-details/user-details.component";
import { UsersListComponent } from "./facility-pages/users-list/users-list.component";
import { AuthenticationComponent } from "./auth-user/authentication/authentication.component";
import { ForgottenPasswordComponent } from "./auth-user/forgotten-password/forgotten-password.component";
import { SelfBookingComponent } from "./user-pages/self-booking/self-booking.component";
import { ProfileComponent } from "./profile/profile.component";
import { EmailConfirmationComponent } from "./auth-user/email-confirmation/email-confirmation.component";
import { HomeInfoComponent } from "./static-pages/home-info/home-info.component";
import { ChangeForgottenPasswordComponent } from "./auth-user/change-forgotten-password/change-forgotten-password.component";
import { ViberConfirmationComponent } from "./shared/dialogs/viber-confirmation/viber-confirmation.component";
import { TermsConditionsComponent } from "./static-pages/terms-conditions/terms-conditions.component";
import { ReservationCalendarComponent } from "./facility-pages/calendar/calendar.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { NewlyRegisteredEditComponent } from "./shared/components/admin/newly-registered/newly-registered-edit/newly-registered-edit.component";
import { NewlyRegisteredListComponent } from "./shared/components/admin/newly-registered/newly-registered-list/newly-registered-list.component";
import { CatchedErrorsListComponent } from "./shared/components/admin/catched-errors/catched-errors-list/catched-errors-list.component";
import { AllUsersListComponent } from "./shared/components/admin/all-users/all-users-list/all-users-list.component";
import { AllUsersEditComponent } from "./shared/components/admin/all-users/all-users-edit/all-users-edit.component";
import { UserHomeComponent } from "./user-pages/user-home/user-home.component";
import { UpcomingBookingComponent } from "./shared/components/user/upcoming-booking/upcoming-booking.component";
import { PreBookingComponent } from "./shared/components/user/pre-booking/pre-booking.component";
import { BookServiceComponent } from "./shared/components/user/book-service/book-service.component";
import { FinishBussinesRegistrationComponent } from "./auth-user/finish-bussines-registration/finish-bussines-registration.component";
// Update Calendar Beahaviour Via Animation
import { UserCalendarComponent } from "./shared/components/user/user-calendar/user-calendar.component";
import { UserSubscriptionComponent } from "./shared/components/user-subscription/user-subscription.component";

const routes: Routes = [
  {
    path: "home-information",
    component: HomeInfoComponent,
  },
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "newly-registered",
    component: NewlyRegisteredListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "newly-registered-details/:id",
    component: NewlyRegisteredEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "all-users",
    component: AllUsersListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "all-users/user-details/:id",
    component: AllUsersEditComponent,
    canActivate: [AuthGuard],
  },
  { path: "catched-errors", component: CatchedErrorsListComponent },
  {
    path: "self-booking", // Not in use!
    component: SelfBookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "viber-confirmation", // not working, need to add mobile styles?
    component: ViberConfirmationComponent,
    canActivate: [AuthGuard],
  },
  { path: "login", component: AuthenticationComponent }, // wont have desktop/mobile menu!
  { path: "forgotten-password", component: ForgottenPasswordComponent },
  { path: "users", component: UsersListComponent, canActivate: [AuthGuard] },
  {
    path: "user-home/:id",
    component: UserHomeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: "facility-schedule/:id",
    component: UserCalendarComponent,
  },
  {
    path: "upcoming",
    component: UpcomingBookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "pre-booking",
    component: PreBookingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "book-service",
    component: BookServiceComponent,
    canActivate: [AuthGuard],
  },
  { path: "email-confirm", component: EmailConfirmationComponent }, // not working, need to add mobile styles?
  {
    path: "change-password",
    component: ChangeForgottenPasswordComponent, // not working, need to add mobile styles?
    canActivate: [AuthGuard],
  },
  {
    path: "finish-registration",
    component: FinishBussinesRegistrationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user",
    component: UserDetailsComponent, // not working, need to add mobile styles?
    canActivate: [AuthGuard],
  },
  {
    path: "facility/:id",
    component: UserSubscriptionComponent,
  },
  { path: "terms-conditions", component: TermsConditionsComponent },
  {
    path: "calendar",
    component: ReservationCalendarComponent,
    canActivate: [AuthGuard],
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "calendar" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
