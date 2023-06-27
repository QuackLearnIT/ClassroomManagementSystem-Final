import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClassBudgetService extends BaseService {
    override API_URL = environment.apiUrl + '/class/budget';

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    getBudgetsByClassId(classId: number): Observable<any> {
        this.API_URL = this.API_URL + '/find';
        return this.httpClient.get(`${this.API_URL}/${classId}`);
    }
}
