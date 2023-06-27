import {Component, OnInit} from '@angular/core';
import {TraineeStatus, TraineeStatusInClass} from "../../../enum/Trainee.enum";
import {DATE_FORMAT, DEFAULT_ACTIVE_PAGE, DEFAULT_PAGE_SIZE} from "../../../common/const";
import {QueryParamsListing} from "../../../model/query-params-listing";
import {ActivatedRoute, Router} from "@angular/router";
import {TraineeService} from "../../../service/trainee.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {ClassStatus} from "../../../enum/ClassStatus.enum";
import {ClassService} from "../../../service/class.service";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Observable, Observer} from "rxjs";
import {FaClassViewComponent} from "../fa-class-view/fa-class-view.component";
import {LocalStorageUtils} from "../../../utilities/local-storage.utils";
import {RoleEnum} from "../../../enum/Role.enum";

@Component({
    selector: 'app-fa-trainee-in-class',
    templateUrl: './fa-trainee-in-class.component.html',
    styleUrls: ['./fa-trainee-in-class.component.scss']
})
export class FaTraineeInClassComponent implements OnInit {
    traineeList: any[] = [];
    traineeListOfCurrentPageRemove: readonly any[] = [];
    traineeListOfCurrentPageAdd: readonly any[] = [];
    classId!: number;
    ClassStatus = ClassStatus;
    DATE_FORMAT: string = DATE_FORMAT;
    queryParam: QueryParamsListing = {
        page: DEFAULT_ACTIVE_PAGE,
        size: DEFAULT_PAGE_SIZE,
    }

    modalQueryParam: QueryParamsListing = {
        page: DEFAULT_ACTIVE_PAGE,
        size: DEFAULT_PAGE_SIZE,
    }

    totalElements: number = 0;
    modalTotalElements: number = 0;
    isLoadingData: boolean = true;
    traineeStatusList = TraineeStatus;
    traineeStatusInClassList = TraineeStatusInClass;
    dateOfBirth!: Date | undefined;
    // Checkbox variables
    checked: boolean = false;
    indeterminate: boolean = false;
    setOfCheckedIdRemove = new Set<number>();
    setOfCheckedIdAdd = new Set<number>();
    fixedColumn = true;
    traineeToAddList: any[] = [];
    isVisibleAdd: any;

    // excel
    loading = false;
    excelFile?: File;
    classStatus!: string;
    acceptedTraineeNo!: number;

    constructor(
        private traineeService: TraineeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private message: NzMessageService,
        private modal: NzModalService,
        private classService: ClassService,
        private faClassViewComponent: FaClassViewComponent) {
    }

    ngOnInit(): void {
        this.getClassId();
        this.getClassStatus();
        this.getAcceptedTraineeNo();
        this.activatedRoute.queryParams.subscribe(params => {
            this.queryParam.page = params['page'] || DEFAULT_ACTIVE_PAGE;
            this.queryParam.size = params['size'] || DEFAULT_PAGE_SIZE;
            this.loadTraineesData();
        })
    }

    getClassId(): void {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            this.classId = Number(paramMap.get('id'));
        })
    }

    getAcceptedTraineeNo(): void {
        this.classService.getDetail(this.classId).subscribe(res => {
            this.acceptedTraineeNo = res.acceptedTraineeNo;
        })
    }

    isClassFull(): boolean {
        return this.totalElements >= this.acceptedTraineeNo;
    }

    isPermitToUpdate() {
        return (LocalStorageUtils.getRole() == RoleEnum.SYSTEM_ADMIN) || (LocalStorageUtils.getRole() == RoleEnum.FA_MANAGER) || (LocalStorageUtils.getRole() == RoleEnum.DELIVERY_MANAGER)
    }

    loadTraineesData(): void {
        this.traineeService.getTraineeInClass(this.classId, this.queryParam).subscribe(res => {
            if (res.data) {
                this.totalElements = res.data.totalElements;
                this.queryParam.size = res.data.size;
                this.traineeList = res.data.content;
                this.isLoadingData = false;
            }
        })
    }

    // Search function
    onSearch(): void {
        this.queryParam.page = DEFAULT_ACTIVE_PAGE;
        if (this.dateOfBirth) {
            this.queryParam.dateOfBirth = this.dateOfBirth.toISOString().split('T')[0];
        }
        if (this.queryParam.phone) {
            this.queryParam.phone = this.queryParam.phone.startsWith('+') ? '0' +
                this.queryParam.phone.substring(3).trim() : this.queryParam.phone;
            this.queryParam.phone = this.queryParam.phone.trim();
        }
        this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.queryParam});
    }

    onReset() {
        this.queryParam = {
            page: DEFAULT_ACTIVE_PAGE,
            size: DEFAULT_PAGE_SIZE,
        }
        this.dateOfBirth = undefined;
        this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.queryParam});
    }

    // Checkbox function remove
    updateCheckedSetRemove(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedIdRemove.add(id);
        } else {
            this.setOfCheckedIdRemove.delete(id);
        }
    }

    onCurrentPageDataChangeRemove(traineeListOfCurrentPage: readonly any[]): void {
        this.traineeListOfCurrentPageRemove = traineeListOfCurrentPage;
        this.refreshCheckedStatusRemove();
    }

    refreshCheckedStatusRemove() {
        this.checked = this.traineeListOfCurrentPageRemove.every(({id}) => this.setOfCheckedIdRemove.has(id));
        this.indeterminate = this.traineeListOfCurrentPageRemove.some(({id}) => this.setOfCheckedIdRemove.has(id)) && !this.checked;
    }

    onItemCheckedRemove(id: number, checked: boolean): void {
        this.updateCheckedSetRemove(id, checked);
        this.refreshCheckedStatusRemove();
    }

    onAllCheckedRemove(checked: boolean): void {
        this.traineeListOfCurrentPageRemove.forEach(({id}) => this.updateCheckedSetRemove(id, checked));
        this.refreshCheckedStatusRemove();
    }

    // Checkbox function add
    updateCheckedSetAdd(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedIdAdd.add(id);
        } else {
            this.setOfCheckedIdAdd.delete(id);
        }
    }

    onCurrentPageDataChangeAdd(traineeListOfCurrentPage: readonly any[]): void {
        this.traineeListOfCurrentPageAdd = traineeListOfCurrentPage;
        this.refreshCheckedStatusAdd();
    }

    refreshCheckedStatusAdd() {
        this.checked = this.traineeListOfCurrentPageAdd.every(({id}) => this.setOfCheckedIdAdd.has(id));
        this.indeterminate = this.traineeListOfCurrentPageAdd.some(({id}) => this.setOfCheckedIdAdd.has(id)) && !this.checked;
    }

    onItemCheckedAdd(id: number, checked: boolean): void {
        this.updateCheckedSetAdd(id, checked);
        this.refreshCheckedStatusAdd();
    }

    onAllCheckedAdd(checked: boolean): void {
        this.traineeListOfCurrentPageAdd.forEach(({id}) => this.updateCheckedSetAdd(id, checked));
        this.refreshCheckedStatusAdd();
    }

    // Pagination function
    onPageChange(pageNumber: number): void {
        this.queryParam.page = pageNumber;
        this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.queryParam});
    }

    onModalPageChange(pageNumber: number): void {
        this.modalQueryParam.page = pageNumber;
        this.loadTraineeToAddData();
        // this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.modalQueryParam});
    }

    onPageSizeChange(pageSize: number): void {
        this.queryParam.size = pageSize;
        this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.queryParam});
    }

    onModalPageSizeChange(pageSize: number): void {
        this.modalQueryParam.size = pageSize;
        this.loadTraineeToAddData()
        // this.router.navigate(['app/fa-class/view', this.classId], {queryParams: this.modalQueryParam});
    }

    setStatusType(status: any): string {
        switch (status) {
            case TraineeStatusInClass.ACTIVE:
                return 'success';
            case TraineeStatusInClass.DEFERRED:
                return 'warning';
            case TraineeStatusInClass.DROP_OUT:
                return 'error';
            case TraineeStatus.WAITING_FOR_CLASS:
                return 'lime';
            case TraineeStatus.ENROLLED:
                return 'success';
            case TraineeStatus.DEFERRED:
                return 'error';
            case TraineeStatus.WAITING_FOR_ALLOCATION:
                return 'warning';
            case TraineeStatus.ALLOCATED:
                return 'geekblue';
        }
        return 'default';
    }

    // Add function
    loadTraineeToAddData(): void {
        this.traineeService.getTraineeToAddInClass(this.classId, this.modalQueryParam).subscribe(res => {
            if (res.data) {
                this.modalTotalElements = res.data.totalElements;
                this.modalQueryParam.size = res.data.size;
                this.traineeToAddList = res.data.content;
                this.isLoadingData = false;
            }
        })
    }

    showAddModal() {
        this.loadTraineeToAddData()
        this.isVisibleAdd = true;
    }

    handleAdd() {
        this.traineeService.addTraineeToClass(this.classId, Array.from(this.setOfCheckedIdAdd)).subscribe(res => {
            if (res.success) {
                this.message.success('Add trainee to class successfully');
                this.loadTraineesData();
                this.faClassViewComponent.reloadActualTraineeNo();
            } else {
                this.message.error('Add failed');
            }
        })
        this.setOfCheckedIdAdd.clear();
        this.refreshCheckedStatusAdd();
        this.isVisibleAdd = false;
    }

    handleCancelAdd() {
        this.setOfCheckedIdAdd.clear();
        this.refreshCheckedStatusAdd();
        this.isVisibleAdd = false;
    }

    onSearchAdd() {
        this.modalQueryParam.page = DEFAULT_ACTIVE_PAGE;
        if (this.dateOfBirth) {
            const modifiedDate = new Date(this.dateOfBirth);
            modifiedDate.setUTCHours(0, 0, 0, 0);
            this.modalQueryParam.dateOfBirth = modifiedDate.toISOString().split('T')[0];
        }
        if (this.modalQueryParam.phone) {
            this.modalQueryParam.phone = this.modalQueryParam.phone.startsWith('+') ? '0' +
                this.modalQueryParam.phone.substring(3).trim() : this.modalQueryParam.phone;
            this.queryParam.phone = this.modalQueryParam.phone.trim();
        }
        this.loadTraineeToAddData();
    }

    onResetAdd() {
        this.modalQueryParam = {
            page: DEFAULT_ACTIVE_PAGE,
            size: DEFAULT_PAGE_SIZE,
        }
        this.loadTraineeToAddData();
    }

    // Update status in class function
    isVisibleUpdate: any;
    mapTraineeIdAndStatus: Map<number, string> = new Map<number, string>();

    getMapTraineeIdAndStatus() {
        this.traineeList.forEach((trainee) => {
            this.mapTraineeIdAndStatus.set(trainee.id, trainee.traineeClassStatus);
        })
    }

    showUpdateModal() {
        this.loadTraineesData();
        this.isVisibleUpdate = true;
    }

    handleUpdate() {
        this.getMapTraineeIdAndStatus();
        this.traineeService.updateStatusInClass(this.classId, this.mapTraineeIdAndStatus).subscribe(res => {
            if (res.success) {
                this.message.success('Update status in class successfully');
                this.loadTraineesData();
            } else {
                this.message.error('Update failed');
            }
            this.mapTraineeIdAndStatus.clear();
        })
        this.isVisibleUpdate = false;

    }

    handleCancelUpdate() {
        this.loadTraineesData();
        this.isVisibleUpdate = false;
    }

    // Delete function
    showRemoveModal() {
        this.modal.confirm({
            nzTitle: 'Do you want to remove these trainees from this class?',
            nzContent: '<b style="color: red;">This action cannot be undone</b>',
            nzOkText: 'Remove',
            nzOkDanger: true,
            nzOnOk: () => {
                this.traineeService.removeTraineeFromClass(this.classId, Array.from(this.setOfCheckedIdRemove)).subscribe(res => {
                    if (res.success) {
                        this.message.success('Remove trainee from class successfully');
                        this.loadTraineesData();
                        this.faClassViewComponent.reloadActualTraineeNo();
                    } else {
                        this.message.error('Remove failed');
                    }
                })
                this.setOfCheckedIdRemove.clear();
                this.refreshCheckedStatusRemove();
            },
            nzCancelText: 'Cancel',
            nzOnCancel: () => {
            }
        });
    }

    getClassStatus(): void {
        this.classService.getDetail(this.classId).subscribe(res => {
            if (res) {
                this.classStatus = res.classStatus;
            }
        })
    }

    isDisableAddButton(): boolean {
        return this.classStatus !== ClassStatus.DRAFT;
    }

    // Excel upload
    beforeUpload = (file: NzUploadFile): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
            const isExcelFile
                = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isExcelFile) {
                this.message.error('You can only upload Excel files!');
                observer.complete();
                return;
            }
            const isLt5M = file.size! / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.message.error('File must be smaller than 5MB!');
                observer.complete();
                return;
            }
            observer.next(isExcelFile && isLt5M);
            observer.complete();
        });

    handleChange(info: { file: NzUploadFile }): void {
        switch (info.file.status) {
            case 'uploading':
                this.loading = true;
                break;
            case 'done':
                this.excelFile = info.file.originFileObj!;
                this.loadTraineesData();
                this.message.success('Import trainee successfully');
                this.loading = false;
                break;
        }
    }
}

