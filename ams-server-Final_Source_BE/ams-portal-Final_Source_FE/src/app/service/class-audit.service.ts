import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ClassAuditService extends BaseService {
    override API_URL = environment.apiUrl + '/class/audit';

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    getAuditsByClassId(classId: number): Observable<any> {
        this.API_URL = this.API_URL + '/find';
        return this.httpClient.get(`${this.API_URL}/${classId}`);
    }

    getAudits(queryParams: any): Observable<any> {
        Object.keys(queryParams).forEach(
            (key: string) => queryParams[key] === undefined && delete queryParams[key]
        );
        return this.httpClient.get(this.API_URL, {params: queryParams});
    }

    createAudit(auditData: any): Observable<any> {
        return this.httpClient.post(this.API_URL, auditData);
    }

    updateAudit(id: number, auditData: any): Observable<any> {
        return this.httpClient.put(`${this.API_URL}/${id}`, auditData);
    }

    getDetail(id: number): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/${id}`);
    }

    deleteAudit(id: number): Observable<any> {
        return this.httpClient.delete(`${this.API_URL}/${id}`);
    }
}
