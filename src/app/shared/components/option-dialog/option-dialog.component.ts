import { Component, Inject, OnInit } from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrls: ['./option-dialog.component.scss']
})
export class OptionDialogComponent implements OnInit {
  constructor(
    private storeServ: FirestoreService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // if items exists , get value to update them
    if (this.data.itemList.length > 0) {
      this.data.itemList.forEach((obj: { id: string; item: string }) => {
        this.addNext(obj.item);
      });
      return;
    }

    // start with 5 inputs
    this.allItems = this.fb.group({
      items: this.fb.array([
        this.createItem(''),
        this.createItem(''),
        this.createItem(''),
        this.createItem(''),
        this.createItem('')
      ])
    });
  }

  allItems: FormGroup = this.fb.group({
    items: this.fb.array([])
  });

  // create new formgroup
  createItem(value: string) {
    return this.fb.group({
      name: [value, [Validators.required]]
    });
  }

  // push new sub formgroup to main formgroup (allItems)
  addNext(value: string) {
    (this.allItems.controls['items'] as FormArray).push(this.createItem(value));
  }

  // remove sub formgroup
  removeField(i: number) {
    (this.allItems.controls['items'] as FormArray).removeAt(i);
  }

  // get all sub formgroups
  get itemsControls() {
    return (this.allItems.get('items') as FormArray)?.controls;
  }

  submit() {
    const items: string[] = [];

    console.log((this.allItems.get('items') as FormArray)?.controls);

    this.allItems.value.items.forEach((item: { name: any }) => {
      if (item.name == '') return;

      const result = item.name.trim();
      const result2 =
        result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();

      items.push(result2);
    });

    this.storeServ.itemsToDb(this.data.tripId, items);
  }
}
