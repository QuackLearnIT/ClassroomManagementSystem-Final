import {Component, OnInit} from '@angular/core';
import {QueryParamsListing} from "../../../model/query-params-listing";
import {DATE_FORMAT, DEFAULT_ACTIVE_PAGE, DEFAULT_PAGE_SIZE} from "../../../common/const";
import {TraineeService} from "../../../service/trainee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {TraineeStatus} from "../../../enum/Trainee.enum";
import {NzButtonSize} from "ng-zorro-antd/button";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Observable, Observer} from "rxjs";
import {LocalStorageUtils} from "../../../utilities/local-storage.utils";
import {RoleEnum} from "../../../enum/Role.enum";

@Component({
    selector: 'app-fa-trainee-listing',
    templateUrl: './fa-trainee-listing.component.html',
    styleUrls: ['./fa-trainee-listing.component.scss']
})
export class FaTraineeListingComponent implements OnInit {
    traineeList: any[] = [];
    traineeListOfCurrentPage: readonly any[] = [];
    DATE_FORMAT: string = DATE_FORMAT;
    queryParam: QueryParamsListing = {
        page: DEFAULT_ACTIVE_PAGE,
        size: DEFAULT_PAGE_SIZE,
    }
    totalElements: number = 0;
    isLoadingData: boolean = true;
    traineeStatusList = TraineeStatus;
    dateOfBirth!: Date | undefined;

    // Checkbox variables
    checked: boolean = false;
    indeterminate: boolean = false;
    setOfCheckedId = new Set<number>();
    disabledCheckbox: boolean = true;
    size: NzButtonSize = 'large';
    fixedColumn = true;

    // excel
    loading = false;
    excelFile?: any;

    constructor(private traineeService: TraineeService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private message: NzMessageService,
                private modal: NzModalService) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.queryParam.page = params['page'] || DEFAULT_ACTIVE_PAGE;
            this.queryParam.size = params['size'] || DEFAULT_PAGE_SIZE;
            this.loadTraineesData();
        })
    }

    loadTraineesData(): void {
        this.traineeService.searchDataList(this.queryParam).subscribe(res => {
            if (res.data) {
                this.totalElements = res.data.totalElements;
                this.queryParam.size = res.data.size;
                this.traineeList = res.data.content;
                this.isLoadingData = false;
            }
        })
    }

    onSearch() {
        this.queryParam.page = DEFAULT_ACTIVE_PAGE;
        if (this.dateOfBirth) {
            this.queryParam.dateOfBirth = this.dateOfBirth.toISOString().split('T')[0];
        }
        if (this.queryParam.phone) {
            this.queryParam.phone = this.queryParam.phone.startsWith('+') ? '0' +
                this.queryParam.phone.substring(3).trim() : this.queryParam.phone;
            this.queryParam.phone = this.queryParam.phone.trim();
        }
        this.router.navigate(['/app/fa-trainee'], {queryParams: this.queryParam});
    }

    onReset() {
        this.queryParam = {
            page: DEFAULT_ACTIVE_PAGE,
            size: DEFAULT_PAGE_SIZE,
        }
        this.dateOfBirth = undefined;
        this.router.navigate(['/app/fa-trainee'], {queryParams: this.queryParam});
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onCurrentPageDataChange(traineeListOfCurrentPage: readonly any[]): void {
        this.traineeListOfCurrentPage = traineeListOfCurrentPage;
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        const listOfEnabledData = this.traineeListOfCurrentPage
            .filter(({
                         disabled,
                         traineeStatus
                     }) => !disabled && traineeStatus === TraineeStatus.DRAFT);
        this.checked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id)) && listOfEnabledData.length > 0;
        this.indeterminate = listOfEnabledData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
        this.disabledCheckbox = listOfEnabledData.length === 0;
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked: boolean) {
        this.traineeListOfCurrentPage.filter(({
                                                  disabled,
                                                  traineeStatus
                                              }) => !disabled && traineeStatus === TraineeStatus.DRAFT)
            .forEach(({id}) => this.updateCheckedSet(id, checked));
        this.refreshCheckedStatus();
    }

    onPageChange(pageNumber: number) {
        this.queryParam.page = pageNumber;
        this.router.navigate(['/app/fa-trainee'], {queryParams: this.queryParam});
    }

    onPageSizeChange(pageSize: number) {
        this.queryParam.size = pageSize;
        this.router.navigate(['/app/fa-trainee'], {queryParams: this.queryParam});
    }

    onDelete() {
        this.modal.confirm({
            nzTitle: 'Are you sure delete these trainees?',
            nzContent: '<b style="color: red;">This action cannot be undone</b>',
            nzOkText: 'Yes',
            nzOkDanger: true,
            nzOnOk: () => {
                this.traineeService.deleteTrainees(Array.from(this.setOfCheckedId)).subscribe(res => {
                    if (res.success) {
                        this.message.success('Delete trainee successfully!');
                        this.setOfCheckedId.clear();
                        this.refreshCheckedStatus();
                        this.ngOnInit();
                    }
                })
            },
            nzCancelText: 'No',
            nzOnCancel: () => console.log('Cancel')
        });
    }

    setStatusType(traineeStatus: any) {
        switch (traineeStatus) {
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

    // Excel upload
    beforeUpload = (file: NzUploadFile): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
            const isExcelFile = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
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

    isPermitToCreate() {
        return (LocalStorageUtils.getRole() == RoleEnum.SYSTEM_ADMIN) || (LocalStorageUtils.getRole() == RoleEnum.FA_MANAGER) || (LocalStorageUtils.getRole() == RoleEnum.DELIVERY_MANAGER)
    }
}
