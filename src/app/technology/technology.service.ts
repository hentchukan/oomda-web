import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechnologyData, TechnologyCollectionData } from './technology.model';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  private API_REST_SERVER = environment.baseUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }).append('Accept', 'application/json')
  };

  constructor(private httpClient: HttpClient) { }

  public getTechnologies(): Observable<TechnologyCollectionData> {
    return this.httpClient.get<TechnologyCollectionData>(this.API_REST_SERVER + '/technologies')
    .pipe(retry(3), catchError(this.handleError));
  }

  public save(data: TechnologyData): Observable<TechnologyData> {
    return this.httpClient.post<TechnologyData>(this.API_REST_SERVER + 'technologies', JSON.stringify(data), this.httpOptions)
    .pipe( catchError(this.handleError));
  }

  public deleteTechnology(data: TechnologyData) {
    return this.httpClient.delete(this.API_REST_SERVER + 'technologies/' + data.name, this.httpOptions);
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
