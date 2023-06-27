import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FacultyService {
    API_URL: string = environment.apiUrl + '/faculty'

    constructor(private httpClient: HttpClient) {
    }

    getAll(): Observable<any> {
        return this.httpClient.get(this.API_URL);
    }
}
