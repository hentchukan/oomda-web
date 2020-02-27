import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AgentData, AgentCollectionData } from '../agent/agent.model';
import { TechnologyCollectionData } from '../technology/technology.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private API_REST_SERVER = environment.baseUrl;;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }).append('Accept', 'application/json')
  };

  constructor(private httpClient: HttpClient) { }

  public findByTechnologies(body: TechnologyCollectionData): Observable<AgentCollectionData> {
    return this.httpClient.post<AgentCollectionData>(this.API_REST_SERVER + '/agents/search', body)
    .pipe(retry(3), catchError(this.handleError));
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
