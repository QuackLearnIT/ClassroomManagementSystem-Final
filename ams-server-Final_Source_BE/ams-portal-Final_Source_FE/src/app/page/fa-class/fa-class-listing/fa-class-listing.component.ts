import {Component, Input, OnInit} from '@angular/core';
import {ClassService} from '../../../service/class.service';
import {DATE_FORMAT, DEFAULT_ACTIVE_PAGE, DEFAULT_PAGE_SIZE,} from '../../../common/const';
import {QueryParamsListing} from '../../../model/query-params-listing';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ClassLocation} from "../../../enum/ClassLocation.enum";
import {ClassType} from "../../../enum/ClassType.enum";
import {ClassStatus} from "../../../enum/ClassStatus.enum";
import {LocalStorageUtils} from "../../../utilities/local-storage.utils";
import {RoleEnum} from "../../../enum/Role.enum";
import {NzButtonSize} from "ng-zorro-antd/button";


@Component({
    selector: 'app-fa-class-listing',
    templateUrl: './fa-class-listing.component.html',
    styleUrls: ['./fa-class-listing.component.scss'],
})
export class FaClassListingComponent implements OnInit {
    @Input() total: number = 0;
    @Input() overBudget: string = '';
    classList: any[] = [];
    queryParam: QueryParamsListing = {
        page: DEFAULT_ACTIVE_PAGE,
        size: DEFAULT_PAGE_SIZE,

    };

    totalElements: number = 0;
    isLoadingData: boolean = true;
    listOfData: readonly Data[] = [];
    classListOfCurrentPage: readonly any[] = [];

    // Checkbox variables
    checked: boolean = false;
    indeterminate: boolean = false;
    setOfCheckedId = new Set<number>();
    disabledCheckbox: boolean = true;
    size: NzButtonSize = 'large';
    fixedColumn = true;
    actualStartDate: Date | undefined;
    actualEndDate: Date | undefined;
    classLocationOptions = (
        Object.keys(ClassLocation) as Array<keyof typeof ClassLocation>
    ).map((key) => ({
        label: key,
        value: ClassLocation[key],
    }));
    classTypeOptions = (
        Object.keys(ClassType) as Array<keyof typeof ClassType>
    ).map((key) => ({
        label: key,
        value: ClassType[key],
    }));
    classStatusOptions = (
        Object.keys(ClassStatus) as Array<keyof typeof ClassStatus>
    ).map((key) => ({
        label: key,
        value: ClassStatus[key],
    }));
    protected readonly DATE_FORMAT = DATE_FORMAT;

    constructor(
        private classService: ClassService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private message: NzMessageService,
        private modal: NzModalService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.queryParam.page = params['page'] || DEFAULT_ACTIVE_PAGE;
            this.queryParam.size = params['size'] || DEFAULT_PAGE_SIZE;
            this.loadClassData();
        });

        this.listOfData = new Array(100).fill(0).map((_, index) => ({
            id: index,
            classCode: ``,
            classType: ``,
            actualStartDate: ``,
            actualEndDate: ``,
            location: ``,
            classStatus: ``,
        }));
    }

    loadClassData(): void {
        this.classService.getAllClass(this.queryParam).subscribe((res) => {
            if (res.data.content) {
                this.totalElements = res.data.totalElements;
                this.queryParam.size = res.data.size;
                this.classList = res.data.content.map((item: any) => {
                    return {...item, checked: false};
                });
                this.isLoadingData = false;
            }
        });
    }

    // Update Warnings
    deleteSelectedClasses(): void {
        if (!this.isTrainee() && !this.isClassAdmin() && !this.isTrainer()) {
            const selectedIds = this.listOfData
                .filter((item) => this.setOfCheckedId.has(item['id']))
                .map((item) => item['id']);

            this.modal.confirm({
                nzTitle: 'Are you sure delete these classes?',
                nzContent: '<b style="color: red;">This action cannot be undone</b>',
                nzOkText: 'Yes',
                nzOkDanger: true,
                nzOnOk: () => {
                    this.classService.deleteClass(selectedIds).subscribe(
                        () => {
                            this.message.success('Delete class successfully!');
                            this.setOfCheckedId.clear();
                            this.loadClassData();
                        },
                        (error) => {
                            console.error('Failed to delete selected classes:', error);
                        }
                    );
                },
                nzCancelText: 'No',
                nzOnCancel: () => console.log('Cancel')
            });
        }
    }

    onPageChange(pageNumber: number) {
        this.queryParam.page = pageNumber;
        this.router.navigate(['/app/fa-class'], {
            queryParams: this.queryParam,
        });
    }

    onPageSizeChange(pageSize: number) {
        this.queryParam.size = pageSize;
        this.router.navigate(['/app/fa-class'], {
            queryParams: this.queryParam,
        });
    }

    changeLink(classId: number) {
        this.isTrainee() || this.isTrainer() ? '' : this.router.navigate([`/app/fa-class/view/${classId}`]);
    }

    isTrainee() {
        return LocalStorageUtils.getRole() == RoleEnum.TRAINEE;
    }

    isClassAdmin() {
        return LocalStorageUtils.getRole() == RoleEnum.CLASS_ADMIN;
    }

    isTrainer() {
        return LocalStorageUtils.getRole() == RoleEnum.TRAINER;
    }

    // Update Checkbox
    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onCurrentPageDataChange(classListOfCurrentPage: readonly any[]): void {
        this.classListOfCurrentPage = classListOfCurrentPage;
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        const listOfEnabledData = this.classListOfCurrentPage
            .filter(({disabled, classStatus}) => !disabled && classStatus === ClassStatus.DRAFT);
        this.checked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id)) && listOfEnabledData.length > 0;
        this.indeterminate = listOfEnabledData.some(({id}) => this.setOfCheckedId.has(id)) && !this.checked;
        this.disabledCheckbox = listOfEnabledData.length === 0;
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked: boolean) {
        this.classListOfCurrentPage.filter(({disabled, classStatus}) => !disabled && classStatus === ClassStatus.DRAFT)
            .forEach(({id}) => this.updateCheckedSet(id, checked));
        this.refreshCheckedStatus();
    }

    setStatusType(traineeStatus: any) {
        switch (traineeStatus) {
            case ClassStatus.DRAFT:
                return 'default';
            case ClassStatus.PLANNED:
                return 'success';
        }
        return 'default';
    }

    onSearch() {
        this.queryParam.page = DEFAULT_ACTIVE_PAGE;
        if (this.actualStartDate) {
            this.queryParam.actualStartDate = this.actualStartDate.toISOString().split('T')[0];
        }
        if (this.actualEndDate) {
            this.queryParam.actualEndDate = this.actualEndDate.toISOString().split('T')[0];
        }
        this.router.navigate(['/app/fa-class'], {queryParams: this.queryParam});
    }

    onReset() {
        this.queryParam = {
            page: DEFAULT_ACTIVE_PAGE,
            size: DEFAULT_PAGE_SIZE,
        }
        this.actualStartDate = undefined;
        this.actualEndDate = undefined;
        this.router.navigate(['/app/fa-class'], {queryParams: this.queryParam});
    }

    isPermitToCreate() {
        return (LocalStorageUtils.getRole() == RoleEnum.SYSTEM_ADMIN)
            || (LocalStorageUtils.getRole() == RoleEnum.FA_MANAGER)
            || (LocalStorageUtils.getRole() == RoleEnum.DELIVERY_MANAGER)
    }
}
