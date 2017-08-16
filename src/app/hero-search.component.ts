import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

//add metadata to the component
@Component({
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService] // why does this component have a provider?
                                // I suppose upon instantiation they will look for one
                                // perhaps, because this is the only component that uses the search service??
})

export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) {}

  search(term: string): void {
    this.searchTerms.next(term); // add to the array of Subjects which make up the search term(s)
  }

  ngOnInit(): void { // what the hell is going on here???
    this.heroes = this.searchTerms
      .debounceTime(300) //wait 300 ms after each key stroke
      .distinctUntilChanged() //ensure it is distinct
      .switchMap(term => term // switch to new observable each time the term changes
        // return the http search observable
        ? this.heroSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Hero[]>([]))
      .catch(error => {
        // TODO: add real error handline
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetail(hero: Hero): void {
    this.router.navigate(['/detail', hero.id])
  }
}
