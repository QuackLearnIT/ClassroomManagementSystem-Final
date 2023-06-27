import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
@Injectable()
export class ClassDetailService extends BaseService {
    override API_URL = environment.apiUrl + '/class/detail';

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    getDetailByClassId(classId: number): Observable<any> {
        this.API_URL = this.API_URL + '/find';
        return this.httpClient.get(`${this.API_URL}/${classId}`);
    }

    saveFileToDatabase(file: File, classCode: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post('http://localhost:8888/api/upload/' + classCode, formData)
    }
}
