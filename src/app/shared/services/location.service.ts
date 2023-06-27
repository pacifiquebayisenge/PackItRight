import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  apiURI = 'https://api.countrystatecity.in/v1/countries';

  // get all countries
  allCountries() {
    return this.http.get(this.apiURI, {
      headers: {
        'X-CSCAPI-KEY': environment.COUNTRY_STATE_CITY_API_KEY
      }
    });
  }

  // get all cities
  allCities(countryIso2: string) {
    return this.http.get(this.apiURI + `/${countryIso2}/cities`, {
      headers: {
        'X-CSCAPI-KEY': environment.COUNTRY_STATE_CITY_API_KEY
      }
    });
  }
}
