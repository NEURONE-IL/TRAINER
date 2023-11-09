import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TriviaStudy } from '../apiTrivia/apiTrivia.service';

export interface Stage {
  _id: string;
  title: string;
  description: string;
  step: number;
  flow: string;
  type: string;
  externalId: string;
  externalName: string;
  module: {
    _id: string;
    name: string;
  };
  assistant: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  image_url: string;
  image_id: string;
}

export interface StudyProgress {
  challenges: number;
  completedChallenges: number;
  percentage: number;
  study: TriviaStudy;
}

@Injectable({
  providedIn: 'root',
})
export class StageService {
  uri = environment.apiURL + 'stage/';

  eventsSources: EventSource[] = [];
  constructor(protected http: HttpClient, private _zone: NgZone) {}

  getStages(): Observable<any> {
    return this.http.get(this.uri, {
      headers: { 'x-access-token': localStorage.getItem('auth_token') },
    });
  }

  getStagesByFlow(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'stage/byFlow/' + flowId, {
      headers: { 'x-access-token': localStorage.getItem('auth_token') },
    });
  }

  getStagesByFlowSortedByStep(flowId: string): Observable<any> {
    return this.http.get(
      environment.apiURL + 'stage/byFlowSortedByStep/' + flowId,
      { headers: { 'x-access-token': localStorage.getItem('auth_token') } }
    );
  }

  getStageByStudent(studentId: string): Observable<any> {
    return this.http.get(
      environment.apiURL + 'userFlow/stagesByStudent/' + studentId,
      { headers: { 'x-access-token': localStorage.getItem('auth_token') } }
    );
  }

  getStage(id: string) {
    return this.http.get(this.uri + id, {
      headers: { 'x-access-token': localStorage.getItem('auth_token') },
    });
  }

  postStage(stage: any) {
    return this.http.post(this.uri, stage);
  }

  putStage(id: string, updatedStage: any): Observable<any> {
    for (var value of updatedStage.entries()) {
      console.log(value[0] + ', ' + value[1]);
    }
    return this.http.put(this.uri + id, updatedStage);
  }

  deleteStage(id: string): Observable<any> {
    return this.http.delete(this.uri + id, {
      headers: { 'x-access-token': localStorage.getItem('auth_token') },
    });
  }

  updateProgress(
    studentId: string,
    flowId: string,
    externalId: string,
    percentage: number
  ): Observable<any> {
    return this.http.put(
      environment.apiURL +
        'userFlow/finishQuiz/' +
        studentId +
        '/' +
        flowId +
        '/' +
        externalId +
        '/' +
        percentage,
      {},
      { headers: { 'x-access-token': localStorage.getItem('auth_token') } }
    );
  }

  // Control de concurrencia
  requestForEdit(stageId: string, user: any): Observable<any> {
    return this.http.put(this.uri + 'requestEdit/' + stageId, user);
  }

  releaseForEdit(stageId: string, user: any): Observable<any> {
    return this.http.put(this.uri + 'releaseStage/' + stageId, user);
  }

  getServerSentEvent(stageId: string, userId: string): Observable<any> {
    return new Observable((observer) => {
      let eventSource = this.getEventSource(stageId, userId);
      let index = this.eventsSources.push(eventSource);

      this.eventsSources[index - 1].onmessage = (event) => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      this.eventsSources[index - 1].onerror = (error) => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  closeEventSourcebyUrl(stageId: string, userId: string): void {
    let url = this.uri + '/editStatus/' + stageId + '/' + userId;
    let index = this.eventsSources.findIndex((ev) => ev.url === url);
    if (index != -1) {
      this.eventsSources[index].close();
      this.eventsSources.splice(index, 1);
    }
  }

  closeAllEventSources(): void {
    this.eventsSources.forEach((event) => {
      event.close();
    });
    this.eventsSources = [];
  }

  getEventSource(stageId: string, userId: string): EventSource {
    return new EventSource(this.uri + 'editStatus/' + stageId + '/' + userId);
  }
}
