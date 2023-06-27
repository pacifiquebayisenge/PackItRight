import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
  constructor(
    private storeServ: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async submit() {
    this.storeServ.deleteTrip(this.data.id);
  }
}
