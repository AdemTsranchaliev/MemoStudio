import { NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AutocompleteComponent } from "./shared/autocomplete/autocomplete.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BookingService } from "./shared/services/booking.service";
import { LoginComponent } from "./auth-user/authentication/login/login.component";
import { UsersListComponent } from "./facility-pages/users-list/users-list.component";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { UserDetailsComponent } from "./shared/dialogs/user-details/user-details.component";
import { UserService } from "./shared/services/user.service";
import { DayService } from "./shared/services/day.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ForgottenPasswordComponent } from "./auth-user/forgotten-password/forgotten-password.component";
import { RegisterComponent } from "./auth-user/authentication/register/register.component";
import { MatTabsModule } from "@angular/material/tabs";
import { AuthenticationComponent } from "./auth-user/authentication/authentication.component";
import { MenuComponent } from "./shared/components/menu/menu.component";
import { MatTableModule } from "@angular/material/table";
import { SelfBookingComponent } from "./user-pages/self-booking/self-booking.component";
import { MatButtonModule } from "@angular/material/button";
import { StudioDatetimePickerComponent } from "./user-pages/self-booking/studio-datetime-picker/studio-datetime-picker.component";
import { DatePipe } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCardModule } from "@angular/material/card";
import { ImageCropperModule } from "ngx-image-cropper";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatChipsModule } from "@angular/material/chips";

// Import BG Language - Use from Pipe
import localeBg from "@angular/common/locales/bg";
import { registerLocaleData } from "@angular/common";
import { ProfileComponent } from "./profile/profile.component";
import { GeneralComponent } from "./profile/general/general.component";
import { SecurityComponent } from "./profile/security/security.component";
import { CalendarComponent } from "./profile/calendar/calendar.component";
import { UtilityService } from "./shared/services/utility.service";
import { EmailConfirmationComponent } from "./auth-user/email-confirmation/email-confirmation.component";
import { HomeInfoComponent } from "./static-pages/home-info/home-info.component";
import { ChangeForgottenPasswordComponent } from "./auth-user/change-forgotten-password/change-forgotten-password.component";
import { SelectionListComponent } from "./shared/components/selection-list/selection-list.component";
import { SideTabSelectionListComponent } from "./shared/components/side-tab-selection-list/side-tab-selection-list.component";
import { ViberConfirmationComponent } from "./shared/dialogs/viber-confirmation/viber-confirmation.component";
import { ViberService } from "./shared/services/viber.service";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { NotificationComponent } from "./profile/notification/notification.component";
import { BusinessCardHeaderComponent } from "./shared/components/business-card-header/business-card-header.component";
import { BusinessCardCalendarComponent } from "./shared/components/business-card-calendar/business-card-calendar.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { LoaderService } from "./shared/services/loader.service";
import { LoaderInterceptor } from "./shared/interceptors/loader.interceptor";
import { LoaderDirective } from "./shared/directives/loader.directive";
import { MatStepperModule } from "@angular/material/stepper";
import { SelfBookingStepAddComponent } from "./shared/components/self-booking-step-add/self-booking-step-add.component";
import { ImgPreviewComponent } from "./shared/dialogs/img-preview/img-preview.component";
import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";
import { AccountService } from "./shared/services/account.service";
import { TermsConditionsComponent } from "./static-pages/terms-conditions/terms-conditions.component";
import { FacilityService } from "./shared/services/facility.service";
import { CalendarOverviewComponent } from "./facility-pages/calendar/calendar-overview/calendar-overview.component";
import { ReservationCalendarComponent } from "./facility-pages/calendar/calendar.component";
import { ReservationListComponent } from "./facility-pages/calendar/reservation-list/reservation-list.component";
import { DateTimeService } from "./shared/services/date-time.service";
import { TruncatePipe } from "./shared/pipes/truncate.pipe";
import { CheckboxSelectComponent } from "./shared/components/checkbox-select/checkbox-select.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { NewlyRegisteredListComponent } from "./shared/components/admin/newly-registered/newly-registered-list/newly-registered-list.component";
import { NewlyRegisteredEditComponent } from "./shared/components/admin/newly-registered/newly-registered-edit/newly-registered-edit.component";
import { CatchedErrorsListComponent } from "./shared/components/admin/catched-errors/catched-errors-list/catched-errors-list.component";
import { CatchedErrorsEditComponent } from "./shared/components/admin/catched-errors/catched-errors-edit/catched-errors-edit.component";
import { AllUsersListComponent } from "./shared/components/admin/all-users/all-users-list/all-users-list.component";
import { AllUsersEditComponent } from "./shared/components/admin/all-users/all-users-edit/all-users-edit.component";
import { UserHomeComponent } from "./user-pages/user-home/user-home.component";
import { UpcomingBookingComponent } from "./shared/components/user/upcoming-booking/upcoming-booking.component";
import { CancelBookingComponent } from "./shared/dialogs/cancel-booking/cancel-booking.component";
import { PreBookingComponent } from "./shared/components/user/pre-booking/pre-booking.component";
import { FinishBussinesRegistrationComponent } from "./auth-user/finish-bussines-registration/finish-bussines-registration.component";
// Update Calendar Beahaviour Via Animation
import { UserCalendarComponent } from './shared/components/user/user-calendar/user-calendar.component';
import { UserCalendarOverviewComponent } from './shared/components/user/user-calendar/user-calendar-overview/user-calendar-overview.component';
import { UserReservationListComponent } from './shared/components/user/user-calendar/user-reservation-list/user-reservation-list.component';
import { BookServiceComponent } from './shared/components/user/book-service/book-service.component';
import { ServicesTabComponent } from './profile/services-tab/services-tab.component';
import { ServicesTabCreateCategoryComponent } from './shared/dialogs/services-tab-create-category/services-tab-create-category.component';
import { ServicesTabEditServiceComponent } from './shared/dialogs/services-tab-edit-service/services-tab-edit-service.component';
import { CreateServiceComponent } from './shared/dialogs/create-service/create-service.component';
import { BookCategoryComponent } from './shared/components/user/book-category/book-category.component';
import { ReservationListBookHourComponent } from './shared/dialogs/reservation-list-book-hour/reservation-list-book-hour.component';
import { CalendarEditDayComponent } from './shared/dialogs/calendar-edit-day/calendar-edit-day.component';
import { MatTooltipModule } from "@angular/material/tooltip";
registerLocaleData(localeBg, "bg");

@NgModule({
  declarations: [
    AppComponent,
    AutocompleteComponent,
    LoginComponent,
    UsersListComponent,
    UserDetailsComponent,
    ForgottenPasswordComponent,
    RegisterComponent,
    AuthenticationComponent,
    MenuComponent,
    SelfBookingComponent,
    StudioDatetimePickerComponent,
    ProfileComponent,
    GeneralComponent,
    SecurityComponent,
    CalendarComponent,
    EmailConfirmationComponent,
    HomeInfoComponent,
    ChangeForgottenPasswordComponent,
    SelectionListComponent,
    SideTabSelectionListComponent,
    ViberConfirmationComponent,
    NotificationComponent,
    BusinessCardHeaderComponent,
    BusinessCardCalendarComponent,
    LoaderComponent,
    LoaderDirective,
    SelfBookingStepAddComponent,
    ImgPreviewComponent,
    TermsConditionsComponent,
    CalendarOverviewComponent,
    ReservationCalendarComponent,
    ReservationListComponent,
    //Pipe
    TruncatePipe,
    CheckboxSelectComponent,
    AdminDashboardComponent,
    NewlyRegisteredListComponent,
    NewlyRegisteredEditComponent,
    CatchedErrorsListComponent,
    CatchedErrorsEditComponent,
    AllUsersListComponent,
    AllUsersEditComponent,
    UserHomeComponent,
    UpcomingBookingComponent,
    CancelBookingComponent,
    PreBookingComponent,
    FinishBussinesRegistrationComponent,
    UserCalendarComponent,
    UserCalendarOverviewComponent,
    UserReservationListComponent,
    BookServiceComponent,
    ServicesTabComponent,
    ServicesTabCreateCategoryComponent,
    ServicesTabEditServiceComponent,
    CreateServiceComponent,
    BookCategoryComponent,
    ReservationListBookHourComponent,
    CalendarEditDayComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    ClipboardModule,
    MatStepperModule,
    ImageCropperModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatTooltipModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BookingService,
    UserService,
    DayService,
    AccountService,
    { provide: LOCALE_ID, useValue: "bg" }, // Set the locale to 'bg'
    DatePipe,
    UtilityService,
    ViberService,
    FacilityService,
    DateTimeService,
    //Interceptors
    LoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
