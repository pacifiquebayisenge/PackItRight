import { LocationService } from 'src/app/shared/services/location.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, count } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-trip-dialog',
  templateUrl: './trip-dialog.component.html',
  styleUrls: ['./trip-dialog.component.scss']
})
export class TripDialogComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private locationServ: LocationService,
    private storeServ: FirestoreService
  ) {}

  countryList: { name: string; iso2: string }[] = [];
  countryFilterList: { name: string; iso2: string }[] = [];

  cityList: string[] = [];
  cityFilterList: string[] = [];

  myForm = this.fb.group({
    country: ['', [Validators.required]],
    countryIso2: ['', [Validators.required]],
    city: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]]
  });

  showSubmit = this.myForm.valid;

  private countrySubscription: Subscription | undefined;
  private citySubscription: Subscription | undefined;

  ngOnDestroy(): void {
    this.countrySubscription?.unsubscribe();
    this.citySubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

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

    target.blur();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCity(value: string, target: any) {
    this.myForm.controls['city'].setValue(value);

    target.blur();
  }

  async submit() {
    if (
      !this.countryFilterList
        .map((country: { name: string; iso2: string }) =>
          country.name.toLowerCase()
        )
        .includes(this.country?.value?.toLowerCase() ?? '')
    ) {
      this.country?.setValue('');
    }

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

    await this.storeServ.tripToDb(
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

  // filter all countries on input
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
