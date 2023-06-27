import {Component, OnInit} from '@angular/core';
import {ClassService} from '../../../service/class.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActivatedRoute, Router} from '@angular/router';
import {DATE_FORMAT} from "../../../common/const";
import {LocalStorageUtils} from "../../../utilities/local-storage.utils";
import {RoleEnum} from "../../../enum/Role.enum";

@Component({
    selector: 'app-fa-class-view',
    templateUrl: './fa-class-view.component.html',
    styleUrls: ['./fa-class-view.component.scss'],
})
export class FaClassViewComponent implements OnInit {
    classId: number = 0;
    viewGeneralData: any;
    viewDetailData: any;
    viewBudgetData: any[] = [];
    viewAuditData: any[] = [];
    fileName!: string;
    fileCurriculum!: string;
    generalPanels = [
        {
            active: true,
            name: 'General',
            disabled: false
        }
    ];
    detailPanels = [
        {
            active: true,
            name: 'Detail',
            disabled: false
        }
    ];
    budgetPanels = [
        {
            active: true,
            name: 'Budget',
            disabled: false
        }
    ];
    auditPanels = [
        {
            active: true,
            name: 'Audit',
            disabled: false
        }
    ];
    protected readonly DATE_FORMAT = DATE_FORMAT;

    constructor(
        private classService: ClassService,
        // private classDetailService: ClassDetailService,
        // private classBudgetService: ClassBudgetService,
        // private classAuditService: ClassAuditService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.classId = this.activatedRoute.snapshot.params['id'];
        this.viewGeneralData = this.classService
            .getDetailByClassId(this.classId)
            .subscribe((data) => {
                this.viewGeneralData = data.clazzDisplayDto;
                this.fileName = data.clazzDisplayDto.learningPath.slice(data.clazzDisplayDto.learningPath.lastIndexOf('/') + 1);
            });

        this.viewDetailData = this.classService
            .getDetailByClassId(this.classId)
            .subscribe((data) => {
                this.viewDetailData = data.classDetailDisplayDto;
                this.fileCurriculum = data.classDetailDisplayDto.curriculum.slice(data.classDetailDisplayDto.curriculum.lastIndexOf('/') + 1);
            });

        this.classService.getDetailByClassId(this.classId).subscribe((data) => {
            this.viewBudgetData = data.classBudgetDisplayDto;
        });
    }

    changeLink(classId: number) {
        this.router.navigate([`/app/fa-class/update/${classId}`]);
    }

    isPermitToUpdate() {
        return (LocalStorageUtils.getRole() == RoleEnum.SYSTEM_ADMIN) || (LocalStorageUtils.getRole() == RoleEnum.FA_MANAGER) || (LocalStorageUtils.getRole() == RoleEnum.DELIVERY_MANAGER)
    }

    calculateAmount(unitExpense: number, quantity: number): number {
        return unitExpense * quantity;

    }

    calculateSum(unitExpense: number, quantity: number, tax: number): number {
        return (unitExpense * quantity) * (1 + tax / 100);
    }

    calculateTotal(): number {
        let total = 0;
        for (let i = 0; i < this.viewBudgetData.length; i++) {
            total += this.calculateSum(this.viewBudgetData[i].unitExpense, this.viewBudgetData[i].quantity, this.viewBudgetData[i].tax)
        }
        return total;
    }

    isOverBudget(): string {
        return this.calculateTotal() > this.viewGeneralData.estimatedBudget ? 'YES' : 'NO';
    }

    reloadActualTraineeNo() {
        this.classService.getDetailByClassId(this.classId).subscribe((data) => {
            this.viewGeneralData = data.clazzDisplayDto;
        })
    }

}
