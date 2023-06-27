import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TripDialogComponent } from 'src/app/shared/components/trip-dialog/trip-dialog.component';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(public dialog: MatDialog, private storeServ: FirestoreService) {}

  tripList: any[] = [];

  isEditTrip = false;
  isDeleteTrip = false;

  // get all trips
  async ngOnInit(): Promise<void> {
    this.tripList = await this.storeServ.allTrips();
  }

  // add new trip
  openDialog() {
    this.isDeleteTrip = false;
    this.isEditTrip = false;

    this.dialog.open(TripDialogComponent, {
      width: '100%',
      panelClass: 'dialog-style'
    });
  }

  editTripTrigger() {
    this.isEditTrip = !this.isEditTrip;
    this.isDeleteTrip = false;
  }

  deleteTripTrigger() {
    this.isDeleteTrip = !this.isDeleteTrip;
    this.isEditTrip = false;
  }
}
