// modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// firebase
import { FirebaseModule } from './modules/firebase.module';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

// material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

// components
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TripCardComponent } from './pages/home-page/components/trip-card/trip-card.component';
import { TripDialogComponent } from './shared/components/trip-dialog/trip-dialog.component';
import { DeleteDialogComponent } from './shared/components/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './shared/components/edit-dialog/edit-dialog.component';
import { TripPageComponent } from './pages/trip-page/trip-page.component';
import { OptionDialogComponent } from './shared/components/option-dialog/option-dialog.component';

import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TripCardComponent,
    TripDialogComponent,
    DeleteDialogComponent,
    EditDialogComponent,
    TripPageComponent,
    OptionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FirebaseModule,
    MatSnackBarModule,
    MatListModule,
    MatTooltipModule
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
