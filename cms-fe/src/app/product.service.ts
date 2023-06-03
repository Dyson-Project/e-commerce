import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, shareReplay} from "rxjs";
import {Category} from "./categories";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  protected categoriesPath = "/api/categories"

  constructor(protected http: HttpClient) {
  }

  public productCategories$: Observable<Category[]> = this.http
    .get<Category[]>(this.categoriesPath)
    .pipe(shareReplay(1))

  public post(): Observable<Category> {
    return this.http.post<Category>(this.categoriesPath, {
      name: 'hello'
    })
      .pipe(shareReplay(1));
  }
}

