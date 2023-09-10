import { NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BookingComponent } from "./booking/booking.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AsyncPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AutocompleteComponent } from "./shared/autocomplete/autocomplete.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BookingService } from "./shared/services/booking.service";
import { LoginComponent } from "./auth-user/authentication/login/login.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from '@angular/material/sort';
import { UserDetailsComponent } from "./shared/dialogs/user-details/user-details.component";
import { UserService } from "./shared/services/user.service";
import { DayService } from "./shared/services/day.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ForgottenPasswordComponent } from "./auth-user/forgotten-password/forgotten-password.component";
import { RegisterComponent } from "./auth-user/authentication/register/register.component";
import { MatTabsModule } from "@angular/material/tabs";
import { AuthenticationComponent } from "./auth-user/authentication/authentication.component";
import { MenuComponent } from "./shared/components/menu/menu.component";
import { MatTableModule } from "@angular/material/table";
import { SelfBookingComponent } from "./self-booking/self-booking.component";
import { MatButtonModule } from "@angular/material/button";
import { StudioDatetimePickerComponent } from "./studio-datetime-picker/studio-datetime-picker.component";
import { DatePipe } from "@angular/common";

// Import BG Language - Use from Pipe
import localeBg from "@angular/common/locales/bg";
import { registerLocaleData } from "@angular/common";
import { ProfileComponent } from "./profile/profile.component";
import { GeneralComponent } from "./profile/general/general.component";
import { SecurityComponent } from "./profile/security/security.component";
import { CalendarComponent } from "./profile/calendar/calendar.component";
import { SideMenuComponent } from "./profile/side-menu/side-menu.component";
import { BookingConfirmationListComponent } from "./booking-confirmation-list/booking-confirmation-list.component";
import { SelfBookingModalComponent } from "./shared/dialogs/self-booking-modal/self-booking-modal.component";
import { UtilityService } from "./shared/services/utility.service";
registerLocaleData(localeBg, "bg");

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
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
    SideMenuComponent,
    BookingConfirmationListComponent,
    SelfBookingModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BookingService,
    UserService,
    DayService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "bg" }, // Set the locale to 'bg'
    DatePipe,
    UtilityService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
