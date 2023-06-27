import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ClassService} from '../../../service/class.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ClassType} from '../../../enum/ClassType.enum';
import {ClassStatus} from '../../../enum/ClassStatus.enum';
import {ClassLocation} from '../../../enum/ClassLocation.enum';
import {ClassBudgetCode} from '../../../enum/ClassBudgetCode.enum';
import {ClassDetailSubjectType} from '../../../enum/ClassDetailSubjectType.enum';
import {ClassDetailSubSubjectType} from '../../../enum/ClassDetailSubSubjectType.enum';
import {ClassDetailDeliveryType} from '../../../enum/ClassDetailDeliveryType.enum';
import {ClassDetailFormatType} from '../../../enum/ClassDetailFormatType.enum';
import {ClassDetailScope} from '../../../enum/ClassDetailScope.enum';


import {DATE_FORMAT,} from '../../../common/const';
import {ClassAuditEventCategory} from '../../../enum/ClassAuditEventCategory.enum';
import {NzDescriptionsSize} from 'ng-zorro-antd/descriptions';
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {Observable, Observer} from "rxjs";
import {ClassAdmin} from "../../../model/classAdmin";
import {Trainer} from "../../../model/trainer";

interface BudgetData {
    item: string;
    unit: string;
    unitExpense: number;
    quantity: number;
    amount: number;
    tax: number;
    sum: number;
    note: string;
    total: number;
    classBudgetId: number;
}


@Component({
    selector: 'app-fa-class-form',
    templateUrl: './fa-class-form.component.html',
    styleUrls: ['./fa-class-form.component.scss'],
})

export class FaClassFormComponent implements OnInit {
    formData!: FormGroup;
    showError: boolean = false;
    classId!: number | undefined;
    isEditing: boolean = false;
    total: number = 0;
    i = 0;
    showFileSizeError = false;
    learningPathFile!: File;
    curriculumFile!: File;

    @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
    listOfData: BudgetData[] = [];
    classAdminList: ClassAdmin[] = [];
    trainerList: Trainer[] = [];
    budgetForm: FormGroup = this.formBuilder.group({
        budgetData: this.formBuilder.array([]),
    });
    panelGeneral = [
        {
            active: true,
            name: 'General',
        }
    ];
    panelDetail = [
        {
            active: false,
            name: 'Detail',
        }
    ];
    panelBudget = [
        {
            active: false,
            name: 'Budget',
        }
    ];
    panelAudit = [
        {
            active: false,
            name: 'Audit',
        }
    ];
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
    classLocationOptions = (
        Object.keys(ClassLocation) as Array<keyof typeof ClassLocation>
    ).map((key) => ({
        label: key,
        value: ClassLocation[key],
    }));
    classBudgetCode = (
        Object.keys(ClassBudgetCode) as Array<keyof typeof ClassBudgetCode>
    ).map((key) => ({
        label: key,
        value: ClassBudgetCode[key],
    }));
    classDetailSubjectType = (
        Object.keys(ClassDetailSubjectType) as Array<
            keyof typeof ClassDetailSubjectType
        >
    ).map((key) => ({
        label: key,
        value: ClassDetailSubjectType[key],
    }));
    classDetailSubSubjectType = (
        Object.keys(ClassDetailSubSubjectType) as Array<
            keyof typeof ClassDetailSubSubjectType
        >
    ).map((key) => ({
        label: key,
        value: ClassDetailSubSubjectType[key],
    }));
    classDetailDeliveryType = (
        Object.keys(ClassDetailDeliveryType) as Array<
            keyof typeof ClassDetailDeliveryType
        >
    ).map((key) => ({
        label: key,
        value: ClassDetailDeliveryType[key],
    }));
    classDetailFormatType = (
        Object.keys(ClassDetailFormatType) as Array<
            keyof typeof ClassDetailFormatType
        >
    ).map((key) => ({
        label: key,
        value: ClassDetailFormatType[key],
    }));
    classDetailScope = (
        Object.keys(ClassDetailScope) as Array<keyof typeof ClassDetailScope>
    ).map((key) => ({
        label: key,
        value: ClassDetailScope[key],
    }));
    classAuditEventCategory = (
        Object.keys(ClassAuditEventCategory) as Array<
            keyof typeof ClassAuditEventCategory
        >
    ).map((key) => ({
        label: key,
        value: ClassAuditEventCategory[key],
    }));
    size: NzDescriptionsSize = 'small';
    protected readonly DATE_FORMAT = DATE_FORMAT;
    // excel
    loading = false;
    excelUrl?: string;

    constructor(
        private formBuilder: FormBuilder,
        private classService: ClassService,
        private router: Router,
        private route: ActivatedRoute,
        private message: NzMessageService
    ) {
    }

    get budgetData(): FormArray {
        return this.budgetForm.get('budgetData') as FormArray;
    }

    ngOnInit(): void {
        this.loadEmployeeData()
        this.formData = this.formBuilder.group({
            clazzId: [null],
            classType: [null, [Validators.required]],
            classCode: [null, [Validators.required]],
            classStatus: [null, [Validators.required]],
            plannedTraineeNo: [null, [Validators.required]],
            acceptedTraineeNo: [null, [Validators.required]],
            actualTraineeNo: [null],
            expectedStartDate: [null, [Validators.required]],
            expectedEndDate: [null, [Validators.required]],
            actualStartDate: [null],
            actualEndDate: [null],
            location: [null, [Validators.required]],
            detailLocation: [null],
            budgetCode: [null, [Validators.required]],
            estimatedBudget: [null, [Validators.required]],
            classAdmin: [null, [Validators.required]],
            learningPath: [null],
            history: [null],
            subjectType: [null],
            subSubjectType: [null],
            deliveryType: [null],
            formatType: [null],
            scope: [null],
            supplier: [null],
            masterTrainer: [null],
            trainer: [null],
            curriculum: [null],
            remarks: [null],
            //
            classBudgetId: [null],
            classBudgetOverBudget: [null],
            item: [null],
            unit: [null],
            unitExpense: [null],
            quantity: [null],
            tax: [null, [Validators.max(100)]],
            note: [null],
            date: [null],
            classAuditEventCategory: [null],
            relatedPeople: [null],
            action: [null],
            pic: [null],
            deadline: [null],
            auditNote: [null],
        }, {
            validators: Validators.compose([
                this.expectedDateValidator(),
                this.traineeNumberValidator(),
                this.actualDateValidator(),
                this.positiveNumberBudgetValidator(),
            ])
        });
        this.budgetForm = this.formBuilder.group({
            total: [0],
            budgetData: this.formBuilder.array([])
        });

        // Manh start add
        this.route.paramMap.subscribe(paramMap => {
            this.classId = paramMap.get('id') ? Number(paramMap.get('id')) : undefined;

            this.route.paramMap.subscribe(paramMap => {
                this.classId = paramMap.get('id') ? Number(paramMap.get('id')) : undefined;

                if (this.classId) {
                    this.isEditing = true;
                    this.classService.getDetailByClassId(this.classId).subscribe(data => {
                        this.formData.patchValue(data.clazzDisplayDto);
                        this.formData.patchValue(data.classDetailDisplayDto);
                        this.formData.patchValue(data.classBudgetDisplayDto);
                        this.formData.patchValue(data.classAuditDisplayDto);

                        for (const index of data.classBudgetDisplayDto) {

                            this.listOfData.push(index);
                            const newRow = this.formBuilder.group({
                                item: [index.item],
                                unit: [index.unit],
                                unitExpense: [index.unitExpense],
                                quantity: [index.quantity],
                                total: [0],
                                amount: [0],
                                tax: [index.tax],
                                note: [index.note],
                                sum: [0],
                                classBudgetId: [index.classBudgetId],
                            });

                            this.calculateAmount(newRow);
                            this.calculateSum(newRow);

                            this.budgetData.push(newRow);
                            this.updateTotal();
                        }
                    });
                }
            });
        });
    }

    traineeNumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const plannedTraineeNo = control.get('plannedTraineeNo');
            const acceptedTraineeNo = control.get('acceptedTraineeNo');
            const actualTraineeNo = control.get('actualTraineeNo');

            if (plannedTraineeNo && acceptedTraineeNo && actualTraineeNo) {
                return plannedTraineeNo.value >= acceptedTraineeNo.value && acceptedTraineeNo.value >= actualTraineeNo.value
                    ? null
                    : {'traineeNumberError': true};
            }
            return null;
        };
    }

    expectedDateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const expectedStartDate = control.get('expectedStartDate');
            const expectedEndDate = control.get('expectedEndDate');

            return expectedEndDate && expectedStartDate && expectedEndDate.value < expectedStartDate.value
                ? {'expectedDateError': true}
                : null;
        };
    }

    actualDateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const actualStartDate = control.get('actualStartDate');
            const actualEndDate = control.get('actualEndDate');

            return actualEndDate && actualStartDate && actualEndDate.value < actualStartDate.value ? {'actualDateError': true} : null;
        };
    }

    positiveNumberBudgetValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            const estimatedBudget = control.get('estimatedBudget');
            return estimatedBudget && estimatedBudget.value <= 0 ? {'positiveNumberBudgetError': true} : null;
        };
    }

    submitSuccess(message: string): void {
        this.message.success(message);
        this.router.navigate(['app/fa-class']);
    }

    submitUpdateSuccess(message: string): void {
        this.message.success(message);
        this.router.navigate(['app/fa-class/view/' + this.classId]);
    }

    submitForm(): void {
        if (this.formData.invalid) {
            this.showError = true;
        } else {
            const formValues = this.formData.value;
            const budgetValues = this.budgetForm.value;

            const budgetData = budgetValues.budgetData.map((item: {
                item: string;
                unit: string;
                unitExpense: string;
                quantity: string;
                amount: string;
                tax: string;
                classBudgetId: string;
                clazzId: string
            }) => ({
                item: item.item,
                unit: item.unit,
                unitExpense: parseFloat(item.unitExpense),
                quantity: parseInt(item.quantity),
                amount: parseFloat(item.amount),
                tax: parseFloat(item.tax),
                classBudgetId: parseInt(item.classBudgetId),
                clazzId: parseInt(item.clazzId)
            }));

            const classData = {
                clazzDto: formValues,
                classDetailDto: formValues,
                classBudgetDto: budgetData,
                fileName: this.learningPathFile ? this.learningPathFile.name : '',
                fileCurriculum: this.curriculumFile ? this.curriculumFile.name : '',
            }

            if (this.classId) {
                this.classService.updateClass(this.classId, classData).subscribe(() => {
                    this.submitUpdateSuccess("Update class general successfully");
                    this.classService.saveFileToDatabase(this.learningPathFile,this.curriculumFile, formValues.classCode).subscribe((response) => {
                        // save fileName in class data


                    });


                });
            } else {
                this.classService.createClass(classData).subscribe((general) => {
                    this.submitSuccess("Create class general successfully");
                    this.classService.saveFileToDatabase(this.learningPathFile,this.curriculumFile, formValues.classCode).subscribe((response) => {
                        // save fileName in class data

                    });

                });
            }
        }
    }

    addBudgetRow(): void {
        this.listOfData = [
            ...this.listOfData,
            {
                item: '',
                unit: '',
                unitExpense: 0,
                quantity: 0,
                total: 0,
                amount: 0,
                tax: 0,
                note: '',
                sum: 0,
                classBudgetId: 0
            }
        ];
        this.i++;
        const newRow = this.formBuilder.group({
            item: [''],
            unit: [''],
            unitExpense: [0],
            quantity: [0],
            total: [0],
            amount: [0],
            tax: [0],
            note: [''],
            sum: [0],
        });
        newRow.get('unitExpense')?.valueChanges.subscribe(() => {
            this.calculateAmount(newRow);
            this.calculateSum(newRow);
        });

        newRow.get('quantity')?.valueChanges.subscribe(() => {
            this.calculateAmount(newRow);
            this.calculateSum(newRow);
        });
        newRow.get('tax')?.valueChanges.subscribe(() => {
            this.calculateSum(newRow);
        });

        this.budgetData.push(newRow);
        this.updateTotal();
    }

    deleteBudgetRow(index: number): void {
        this.listOfData.splice(index, 1);
        this.budgetData.removeAt(index);
        this.updateTotal();
    }

    getOverBudgetStatus(): string {
        const total = this.budgetForm.get('total')?.value || 0;
        const estimatedBudget = this.formData.get('estimatedBudget')?.value || 0;
        return total > estimatedBudget ? 'YES' : 'NO';
    }

    calculateAmount(row: FormGroup): void {
        const unitExpense = row.get('unitExpense')?.value || 0;
        const quantity = row.get('quantity')?.value || 0;
        const amount = unitExpense * quantity;
        row.patchValue({amount}, {emitEvent: false});
    }

    calculateSum(row: FormGroup): void {
        const amount = row.get('amount')?.value || 0;
        const tax = row.get('tax')?.value || 0;
        const sum = amount * (1 + tax / 100);
        row.patchValue({sum}, {emitEvent: false});
    }

    onInputChange(index: number): void {
        const data = this.budgetData.controls[index] as FormGroup;
        const unitExpense = data.get('unitExpense')?.value || 0;
        const quantity = data.get('quantity')?.value || 0;
        const amount = unitExpense * quantity;
        data.get('amount')?.setValue(amount);

        this.calculateSum(data);
        this.updateTotal();
    }


    updateTotal(): void {
        const total = this.budgetData.controls.reduce((sum, control) => {
            const sumValue = control.get('sum')?.value || 0;
            return sum + sumValue;
        }, 0);
        this.budgetForm.get('total')?.setValue(total);
    }

    onSubmit(): void {
        for (const i in this.formData.controls) {
            this.formData.controls[i].markAsDirty();
            this.formData.controls[i].updateValueAndValidity();
        }
    }

    handleFileInputLearningPath(event: any): void {
        const file = event.target.files[0];
        const maxSizeInBytes = 5 * 1024 * 1024;

        if (file && file.size > maxSizeInBytes) {
            this.showFileSizeError = true;
            event.target.value = '';
        } else {
            this.showFileSizeError = false;
            this.learningPathFile = file;
        }
    }
    handleFileInputCurriculum(event: any): void {
        const file = event.target.files[0];
        const maxSizeInBytes = 1024 * 1024;

        if (file && file.size > maxSizeInBytes) {
            this.showFileSizeError = true;
            event.target.value = '';
        } else {
            this.showFileSizeError = false;
            this.curriculumFile = file;
        }
    }

    loadEmployeeData() {
        this.classService.getClassAdmin().subscribe(res => {
            this.classAdminList = res.data;
        });
        this.classService.getTrainer().subscribe(res => {
            this.trainerList = res.data;
        });
    }
}

