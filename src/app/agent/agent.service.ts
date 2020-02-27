import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AgentCollectionData, AgentData } from './agent.model';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TechnologyService } from '../technology/technology.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private API_REST_SERVER = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }).append('Accept', 'application/json')
  };

  constructor(private httpClient: HttpClient) { }

  public getAgents(): Observable<AgentCollectionData> {
    return this.httpClient.get<AgentCollectionData>(this.API_REST_SERVER + '/agents').pipe(retry(3), catchError(this.handleError));
  }

  public findAgentByName(agentName: string): Observable<AgentData> {
    return this.httpClient.get<AgentData>(this.API_REST_SERVER + '/agents/' + agentName).pipe(retry(3), catchError(this.handleError));
  }

  public getAgent(id: number): Observable<AgentData> {
    return this.httpClient.get<AgentData>(this.API_REST_SERVER + '/agents/' + id).pipe(retry(3), catchError(this.handleError));
  }

  public save(data: AgentData, update: boolean): Observable<AgentData> {
    if (update) {
      return this.httpClient.put<AgentData>(this.API_REST_SERVER + '/agents/' + data.id, JSON.stringify(data), this.httpOptions)
      .pipe( catchError(this.handleError));
    } else {
      return this.httpClient.post<AgentData>(this.API_REST_SERVER + 'agents', JSON.stringify(data), this.httpOptions)
      .pipe( catchError(this.handleError));
    }
  }

  public deleteAgent(id: number) {
    return this.httpClient.delete(this.API_REST_SERVER + '/agents/' + id)
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
