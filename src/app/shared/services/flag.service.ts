import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  constructor(private http: HttpClient) {}

  // get flag image link based on the country
  getFlag(country: string): Observable<string> {
    return this.http
      .get('https://restcountries.com/v3.1/name/' + country)
      .pipe(map((data: any) => data[0].flags.svg));
  }
}
