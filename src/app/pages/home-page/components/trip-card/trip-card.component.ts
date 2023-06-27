import { MatDialog } from '@angular/material/dialog';
import { FlagService } from './../../../../shared/services/flag.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TripDialogComponent } from 'src/app/shared/components/trip-dialog/trip-dialog.component';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from 'src/app/shared/components/edit-dialog/edit-dialog.component';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.scss']
})
export class TripCardComponent implements OnInit, OnDestroy {
  constructor(private flagServ: FlagService, public dialog: MatDialog) {}

  @Input() trip: any = null;
  @Input() toEdit = false;
  @Input() toDelete = false;

  // flag img src
  imgSrc = '';

  // parameters for the tooltip
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  // Store the subscription
  private flagSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.getFlag();
  }

  // Unsubscribe when the component is destroyed
  ngOnDestroy(): void {
    if (this.flagSubscription) {
      this.flagSubscription.unsubscribe();
    }
  }

  // get the flag based on the country
  async getFlag() {
    this.flagSubscription = this.flagServ
      .getFlag(this.trip.country)
      .subscribe((link) => {
        this.imgSrc = link;
      });
  }

  editTrip() {
    this.dialog.open(EditDialogComponent, {
      width: '100%',
      panelClass: 'dialog-style',
      data: this.trip
    });
  }

  deleteTrip() {
    this.dialog.open(DeleteDialogComponent, {
      width: '100%',
      panelClass: 'dialog-style',
      data: this.trip
    });
  }
}
