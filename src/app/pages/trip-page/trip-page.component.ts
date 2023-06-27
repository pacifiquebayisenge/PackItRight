import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { OptionDialogComponent } from 'src/app/shared/components/option-dialog/option-dialog.component';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { FlagService } from 'src/app/shared/services/flag.service';

@Component({
  selector: 'app-trip-page',
  templateUrl: './trip-page.component.html',
  styleUrls: ['./trip-page.component.scss']
})
export class TripPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private storeServ: FirestoreService,
    private flagServ: FlagService,
    private dialogServ: MatDialog
  ) {}

  trip: any;
  imgSrc = '';
  itemList: any[] = [];

  // tooltip parameters
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  async ngOnInit(): Promise<void> {
    // get trip id from url
    const id = this.route.snapshot.paramMap.get('tripId');

    // get trip based on id
    this.trip = await this.storeServ.tripById(id ?? '');

    // get flag based on trip country
    this.flagServ.getFlag(this.trip.country).subscribe((link) => {
      this.imgSrc = link;
    });

    // get all item of trip
    this.itemList = await this.storeServ.allItems(id ?? '');
  }

  // manage items of the trip
  openDialog() {
    this.dialogServ.open(OptionDialogComponent, {
      width: '100%',
      panelClass: 'dialog-style',
      data: { tripId: this.trip.id, itemList: this.itemList }
    });
  }
}
