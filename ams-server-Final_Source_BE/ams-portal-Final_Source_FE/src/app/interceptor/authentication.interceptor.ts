import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalStorageUtils} from "../utilities/local-storage.utils";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor() {
    }

    API_IGNORE_ACCESS_TOKEN = ['/api/login'];

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isIgnore = this.API_IGNORE_ACCESS_TOKEN.find(apiIgnore =>
            request.url.indexOf(apiIgnore) !== -1) !== undefined;

        const accessToken = LocalStorageUtils.getAccessToken();

        if (!isIgnore && accessToken) {
            const authenticationReq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
            });

            return next.handle(authenticationReq);
        }
        return next.handle(request);
    }


}
