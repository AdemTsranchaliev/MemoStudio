import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatInputModule } from "@angular/material/input";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BookingComponent } from "./booking/booking.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AsyncPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AutocompleteComponent } from "./shared/autocomplete/autocomplete.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BookingService } from "./shared/services/booking.service";
import { LoginComponent } from "./login/login.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { Ng2PaginationModule } from "ng2-pagination";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UserService } from "./shared/services/user.service";
import { DayService } from "./shared/services/day.service";

@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    AutocompleteComponent,
    LoginComponent,
    UsersListComponent,
    UserDetailsComponent,
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
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BookingService,
    UserService,
    DayService,
    Ng2PaginationModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
