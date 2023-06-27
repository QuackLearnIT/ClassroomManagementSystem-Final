import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthenticationService} from "../service/authentication.service";
import {HttpStatus} from "../common/const";
import {LocalStorageUtils} from "../utilities/local-storage.utils";
import {environment} from "../environments/environment";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    apiUrl: string = environment.apiUrl;
    API_IGNORE_HANDLE_ERROR = ['/login', '/refresh-token', '/logout'];
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private router: Router,
                private message: NzMessageService,
                private authenticationService: AuthenticationService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isIgnore = this.API_IGNORE_HANDLE_ERROR
            .filter(apiIgnore => request.url.replace(this.apiUrl, '').indexOf(apiIgnore) !== -1).length > 0;
        if (isIgnore) {
            return next.handle(request);
        } else {
            return next.handle(request)
                .pipe(catchError((error: any) => {
                    return this.handleError(error, request, next)
                }));
        }

    }

    private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {
        if (error && error.status === HttpStatus.UNKNOWN_ERROR) {
            this.message.error('Can not connect to server!');
        } else if (error.error && error.error.message) {
            this.message.error(error.error.message);
        } else if (error.error && Array.isArray(error.error)) {
            this.message.error(error.error.map(err => err.message).join('<br/>'));
        } else if (error && error.status === HttpStatus.FORBIDDEN) {
            this.authenticationService.logout();
            this.router.navigate(['/login']);
        } else if (error && error.status === HttpStatus.UNAUTHORIZED) {
            if (LocalStorageUtils.getRefreshToken()) {
                return this.handle401Error(request, next);
            } else {
                this.authenticationService.logout();
                this.router.navigate(['/login']);
            }
        } else if (error.error.data.errors && Array.isArray(error.error.data.errors)) {
            const errorList = error.error.data.errors;
            const errorMessage = errorList
                .map((error: { address: any; detail: any }) => `<p><strong>Cell ${error.address}:</strong> ${error.detail}</p>`)
                .join('');
            const style = `
    <style>
        .error-message {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 10px;
            margin-bottom: 10px;
        }

        .error-message strong {
            color: #721c24;
        }
    </style>
`;

            const message = `
    ${style}
    <div class="error-message">
        <p><strong>Error:</strong></p>
        ${errorMessage}
    </div>
`;
            this.message.warning(errorMessage);
        } else {
            this.message.error("Something bad happened!");
        }
        return throwError(() => error);
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;

            this.refreshTokenSubject.next(null);
            return this.authenticationService.getRefreshToken()
                .pipe(
                    switchMap(token => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token.data.accessToken);
                        // this.authenticationService.accessToken = token.accessToken;
                        LocalStorageUtils.saveAccessToken(token.data.accessToken);
                        LocalStorageUtils.saveRefreshToken(token.data.refreshToken);

                        return next.handle(this.addToken(request, token.data.accessToken));
                    }),
                    catchError((error: any) => {
                        this.isRefreshing = false;
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                        return throwError('Something bad happened; please try again later.');
                    })
                );
        } else {
            return this.refreshTokenSubject
                .pipe(
                    filter(token => token != null),
                    take(1),
                    switchMap(accessToken => {
                        return next.handle(this.addToken(request, accessToken));
                    }));
        }
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }


}
