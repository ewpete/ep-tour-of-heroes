import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map'; // what is this doing?? adding a map function

import { Hero } from './hero';

@Injectable() // use this for services...
export class HeroSearchService {
  constructor(private http: Http) {} // when instantiated, looks for providers that match the constructor parameters

  search(term: string): Observable<Hero[]> {
    return this.http
              .get(`api/heroes/?name=${term}`)
              .map(response => response.json().data as Hero[]);
  }
}
