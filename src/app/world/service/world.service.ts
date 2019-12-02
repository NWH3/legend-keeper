import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/page.model';
import { PageRequest } from '../model/page-request.model';
import { World } from '../model/world.model';
import { WorldMap } from '../model/world-map.model';
import { WorldListDto } from '../model/world-list-dto.model';
import { CreateWorldRequest } from '../model/create-world-request.model';
import { CreateWorldSessionRequest } from '../model/create-world-session-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorldService {

  constructor(private httpClient: HttpClient) {
  }

  getAllWorlds(pageRequest: PageRequest): Observable<HttpResponse<Page<WorldListDto>>> {
    return this.httpClient.get<Page<WorldListDto>>(environment.worldBaseUrl +
      'worlds' + this.getPageRequestUrl(pageRequest), { observe: 'response' });
  }

  getWorldById(id: string): Observable<HttpResponse<World>> {
    return this.httpClient.get<World>(environment.worldBaseUrl +
      'id/' + id, { observe: 'response' });
  }

  getWorldMapById(id: string): Observable<HttpResponse<WorldMap>> {
    return this.httpClient.get<WorldMap>(environment.worldBaseUrl +
      'map/id/' + id, { observe: 'response' });
  }

  createWorldMap(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.put<World>(environment.worldBaseUrl +
      'create/map', request, { observe: 'response' });
  }

  createWorld(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.post<World>(environment.worldBaseUrl +
      'create/world', request, { observe: 'response' });
  }

  createWorldSession(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.post<World>(environment.worldBaseUrl +
      'create/session', request, { observe: 'response' });
  }

  updateWorld(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.put<World>(environment.worldBaseUrl +
      'update/world', request, { observe: 'response' });
  }

  updateWorldMap(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.put<World>(environment.worldBaseUrl +
      'update/map', request, { observe: 'response' });
  }

  updateWorldSession(request: any): Observable<HttpResponse<World>> {
    return this.httpClient.put<World>(environment.worldBaseUrl +
      'update/session', request, { observe: 'response' });
  }

  deleteWorldMap(worldId: string, mapId: string): Observable<HttpResponse<World>> {
    return this.httpClient.delete<World>(environment.worldBaseUrl +
      'delete/world/' + worldId + '/map/' + mapId, { observe: 'response' });
  }

  deleteWorld(worldId: string): Observable<HttpResponse<World>> {
    return this.httpClient.delete<World>(environment.worldBaseUrl +
      'delete/world/' + worldId, { observe: 'response' });
  }

  deleteWorldSession(worldId: string, sessionId: string): Observable<HttpResponse<World>> {
    return this.httpClient.delete<World>(environment.worldBaseUrl +
      'delete/world/' + worldId + '/session/' + sessionId, { observe: 'response' });
  }

  getPageRequestUrl(page: PageRequest): string {
    if (page == null || page == undefined) {
      return '?page=0&size=10';
    }

    let url = '?';
    if (page.page != null && page.page != undefined) {
      url += 'page=' + page.page;
    }

    if (page.size != null && page.size != undefined) {
      if (page.page != null) {
          url += '&';
      }
      url += 'size=' + page.size;
    }

    if (page.sort != null && page.sort != undefined) {
      if (page.page != null || page.size != null) {
          url += '&';
      }
      url += 'sort=' + page.sort;
    }
    return url;
  }
}
