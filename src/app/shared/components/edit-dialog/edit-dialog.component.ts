import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { LocationService } from '../../services/location.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private locationServ: LocationService,
    private storeServ: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  private countrySubscription: Subscription | undefined;
  private citySubscription: Subscription | undefined;

  countryList: { name: string; iso2: string }[] = [];
  countryFilterList: { name: string; iso2: string }[] = [];

  cityList: string[] = [];
  cityFilterList: string[] = [];

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
    this.citySubscription?.unsubscribe();
  }

  myForm = this.fb.group({
    country: [this.data.country, [Validators.required]],
    countryIso2: [this.data.countryIso2, [Validators.required]],
    city: [this.data.city, [Validators.required]],
    startDate: [this.data.startDate.toDate(), [Validators.required]],
    endDate: [this.data.endDate.toDate(), [Validators.required]]
  });

  get country() {
    return this.myForm.get('country');
  }
  get countryIso2() {
    return this.myForm.get('countryIso2');
  }

  get city() {
    return this.myForm.get('city');
  }

  get startDate() {
    return this.myForm.get('startDate');
  }

  get endDate() {
    return this.myForm.get('endDate');
  }

  // set country name + iso2 of that country
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCountry(value: { name: string; iso2: string }, target: any) {
    this.myForm.controls['country'].setValue(value.name);
    this.myForm.controls['countryIso2'].setValue(value.iso2);
    this.myForm.controls['city'].setValue('');
    this.loadCities(value.iso2);

    // remove focus
    target.blur();
  }

  // set city
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCity(value: string, target: any) {
    this.myForm.controls['city'].setValue(value);

    target.blur();
  }

  async submit() {
    // if country value not exists in api generated country list
    if (
      !this.countryFilterList
        .map((country: { name: string; iso2: string }) =>
          country.name.toLowerCase()
        )
        .includes(this.country?.value?.toLowerCase() ?? '')
    ) {
      this.country?.setValue('');
    }

    // if city value not exists in api generated city list
    if (
      !this.cityFilterList
        .map((city: string) => city.toLowerCase())
        .includes(this.city?.value?.toLowerCase() ?? '')
    ) {
      this.city?.setValue('');
    }

    if (!this.startDate?.value || !this.endDate?.value) {
      return;
    }

    console.log(this.myForm.value);

    await this.storeServ.updateTrip(
      this.data.id,
      this.country?.value ?? '',
      this.countryIso2?.value ?? '',
      this.city?.value ?? '',
      new Date(this.startDate?.value) ?? '',
      new Date(this.endDate?.value) ?? ''
    );
  }

  // Get all countries
  loadCountries() {
    this.countrySubscription = this.locationServ
      .allCountries()
      .subscribe((response: any) => {
        this.countryList = response.map(
          (item: { name: string; iso2: string }) => ({
            name: item.name,
            iso2: item.iso2
          })
        );

        this.countryFilterList = this.countryList;
      });
  }

  // filter all countries on input
  reloadCountrySuggestions() {
    this.countryFilterList = [];

    const value = this.country?.value || '';

    if (value == '') {
      this.countryFilterList = this.countryList;
      return;
    }

    this.countryList.forEach((country) => {
      if (country.name.toLowerCase().includes(value.toLowerCase())) {
        this.countryFilterList.push(country);
      }
    });
  }

  loadCities(iso2: string) {
    this.citySubscription = this.locationServ
      .allCities(iso2)
      .subscribe((response: any) => {
        this.cityList = response.map((item: { name: string }) => item.name);

        this.cityFilterList = this.cityList;
      });
  }

  // filter all cities on input
  reloadCitySuggestions() {
    this.cityFilterList = [];

    const value = this.city?.value || '';

    if (value == '') {
      this.cityFilterList = this.cityList;
      return;
    }

    this.cityList.forEach((city) => {
      if (city.toLowerCase().includes(value.toLowerCase())) {
        this.cityFilterList.push(city);
      }
    });
  }
}
