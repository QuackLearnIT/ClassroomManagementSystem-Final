import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../environments/environment";


export class BaseService {

  protected API_URL = environment.apiUrl;
  constructor(protected httpClient: HttpClient, ) {
  }

  searchDataList(queryParams: any) : Observable<any> {
    // undefined => "undefined"
    Object.keys(queryParams).forEach((key: string) => queryParams[key] === undefined && delete queryParams[key]);
    return this.httpClient.get(this.API_URL, {params: queryParams});
  }

  delete(id: any) {
    return this.httpClient.delete(this.API_URL + `/${id}`);
  }

  create(formData: any): Observable<any> {
    return this.httpClient.post<any>(this.API_URL, formData);
  }

  update(formData: any, id: any): Observable<any> {
    return this.httpClient.put<any>(this.API_URL + `/${id}`, formData);
  }
}
