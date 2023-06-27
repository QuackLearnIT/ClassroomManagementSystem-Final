import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LocalStorageUtils} from "../utilities/local-storage.utils";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    API_URL = environment.apiUrl + '/login';
    API_REFRESH_URL = environment.apiUrl + '/refreshtoken'
    API_LOGOUT_URL = environment.apiUrl + '/logout'

    constructor(private httpClient: HttpClient) {
    }

    login(payload: any): Observable<any> {
        return this.httpClient.post(this.API_URL, payload);
    }

    logout(): Observable<any> {
        const refreshToken = {
            refreshToken: LocalStorageUtils.getRefreshToken()
        }
        LocalStorageUtils.removeLoginInfo();
        return this.httpClient.post(this.API_LOGOUT_URL, refreshToken);
    }

    getRefreshToken(): Observable<any> {
        const refreshToken = {
            refreshToken: LocalStorageUtils.getRefreshToken()
        }
        return this.httpClient.post(this.API_REFRESH_URL, refreshToken);
    }
}
