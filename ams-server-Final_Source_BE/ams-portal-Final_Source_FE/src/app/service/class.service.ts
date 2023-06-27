import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {BaseService} from "./base.service";
import {environment} from "../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ClassService extends BaseService {
    override API_URL = environment.apiUrl + '/class';
    API_Employee_URL = environment.apiUrl + '/employees';
    private fileNameSource = new BehaviorSubject('');
    // currentFileName = this.fileNameSource.asObservable();

    currentFileName = new BehaviorSubject<string>('');
    fileName!: string;

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    }

    getAllClass(queryParams: any): Observable<any> {
        Object.keys(queryParams).forEach((key: string) => queryParams[key] === undefined && delete queryParams[key]);
        return this.httpClient.get(this.API_URL, {params: queryParams});
    }

    createClass(classData: any): Observable<any> {
        return this.httpClient.post(this.API_URL, classData,
            {headers: {'Authorization': `Bearer  ${localStorage.getItem('access_token')}`}});
    }

    updateClass(id: number, classData: any): Observable<any> {
        return this.httpClient.put(`${this.API_URL}/${id}`, classData,
            {headers: {'Authorization': `Bearer  ${localStorage.getItem('access_token')}`}});
    }

    getDetail(id: number): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/${id}`,
            {headers: {'Authorization': `Bearer  ${localStorage.getItem('access_token')}`}});
    }

    getDetailByClassId(id: number): Observable<any> {
        return this.httpClient.get(`${this.API_URL}/find/${id}`);
    }

    deleteClass(ids: number[]): Observable<any> {

        const idsString = ids.join(',');

        return this.httpClient.delete(`${this.API_URL}/delete?ids=${idsString}`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`},
        });
    }

    saveFileToDatabase(learningPathFile: File, curriculumFile: File, classCode: string): Observable<any> {
        const formData = new FormData();
        formData.append('learningPath', learningPathFile);
        formData.append('curriculum', curriculumFile);
        return this.httpClient.post('http://localhost:8888/api/upload/' + classCode, formData)
    }

    getClassAdmin(): Observable<any>{
        return this.httpClient.get(`${this.API_URL}/classAdmins`);
    }

    getTrainer(): Observable<any>{
        return this.httpClient.get(`${this.API_URL}/trainers`);
    }

}
