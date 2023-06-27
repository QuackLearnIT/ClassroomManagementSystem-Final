import {Injectable} from '@angular/core';
import {BaseService} from "./base.service";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TraineeService extends BaseService {
    override API_URL = environment.apiUrl + '/trainee';

    constructor(protected override httpClient: HttpClient) {
        super(httpClient);
    } // DI

    getTrainees(queryParams: any): Observable<any> {
        // undefined => "undefined"
        Object.keys(queryParams).forEach((key: string) => queryParams[key] === undefined && delete queryParams[key]);
        return this.httpClient.get(this.API_URL, {params: queryParams});
    }

    updateTrainee(id: number, traineeData: any): Observable<any> {
        return this.httpClient.put(`${this.API_URL}/${id}`, traineeData);
    }

    getDetail(id: number | undefined): Observable<any> {
        return id ? this.httpClient.get(`${this.API_URL}/${id}`) : this.httpClient.get(`${this.API_URL}/profile`);
    }

    deleteTrainees(deleteId: number[]): Observable<any> {
        const deleteIdString = deleteId.join(',');
        return this.httpClient.delete(`${this.API_URL}?deleteId=${deleteIdString}`);
    }

    getTraineeInClass(id: number, queryParams: any): Observable<any> {
        Object.keys(queryParams).forEach((key: string) => queryParams[key] === undefined && delete queryParams[key]);
        return this.httpClient.get(`${this.API_URL}/inclass/${id}`, {params: queryParams});
    }

    getTraineeToAddInClass(id: number, queryParams: any): Observable<any> {
        Object.keys(queryParams).forEach((key: string) => queryParams[key] === undefined && delete queryParams[key]);
        return this.httpClient.get(`${this.API_URL}/toadd/${id}`, {params: queryParams});
    }

    addTraineeToClass(classId: number, addId: number[]): Observable<any> {
        const addIdString = addId.join(',');
        return this.httpClient.post(`${this.API_URL}/addtrainee/${classId}?traineeid=${addIdString}`, {});
    }

    updateStatusInClass(classId: number, mapTraineeIdAndStatus: Map<number, string>): Observable<any> {
        const mapTraineeIdAndStatusString: any = {};
        mapTraineeIdAndStatus.forEach((value: string, key: number) => mapTraineeIdAndStatusString[key] = value);
        return this.httpClient.put(`${this.API_URL}/inclass/${classId}`, mapTraineeIdAndStatusString);
    }

    importTrainee(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post(`${this.API_URL}/import`, formData);
    }

    importTraineeInClass(file: File, id: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.httpClient.post(`${this.API_URL}/import/${id}`, formData);
    }

    removeTraineeFromClass(classId: number, removeId: number[]): Observable<any> {
        const removeIdString = removeId.join(',');
        return this.httpClient.delete(`${this.API_URL}/inclass/${classId}?traineeId=${removeIdString}`);
    }
}
