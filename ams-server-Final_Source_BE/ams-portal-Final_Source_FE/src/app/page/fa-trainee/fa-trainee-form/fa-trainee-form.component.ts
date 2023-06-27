import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {TraineeService} from "../../../service/trainee.service";
import {AllowanceGroup, TraineeStatus} from "../../../enum/Trainee.enum";
import {NzButtonSize} from "ng-zorro-antd/button";
import {UniversityService} from "../../../service/university.service";
import {University} from "../../../model/university";
import {DATE_FORMAT} from "../../../common/const";
import {FacultyService} from "../../../service/faculty.service";
import {Faculty} from "../../../model/faculty";

@Component({
    selector: 'app-fa-trainee-form',
    templateUrl: './fa-trainee-form.component.html',
    styleUrls: ['./fa-trainee-form.component.scss']
})
export class FaTraineeFormComponent implements OnInit {
    validateForm!: FormGroup;
    traineeId!: number | undefined
    size: NzButtonSize = 'large';
    allowanceGroupList = AllowanceGroup
    traineeStatusList = TraineeStatus
    universityList: University [] = []
    facultyList: Faculty [] = []
    DATE_FORMAT = DATE_FORMAT
    value = 0;

    constructor(private formBuilder: FormBuilder,
                protected traineeService: TraineeService,
                private fb: UntypedFormBuilder,
                private router: Router,
                private message: NzMessageService,
                private activeRoute: ActivatedRoute,
                private universeService: UniversityService,
                private facultyService: FacultyService) {
    }

    ngOnInit(): void {
        this.loadUniversity()
        this.loadFaculty()
        this.validateForm = this.formBuilder.group({
            account: [null, [Validators.required]],
            fullName: [null, [Validators.required]],
            gender: [null, [Validators.required]],
            dateOfBirth: [null, [Validators.required]],
            phone: [null, [Validators.pattern("^(\\+84|0)\\d{9}$"), Validators.required]],
            tpbAccount: [null],
            allowanceGroup: [null],
            salary: [null, [Validators.required]],
            email: [null, [Validators.email, Validators.required]],
            traineeStatus: [null],
            universityId: [null],
            facultyId: [null],
            contractStartDate: [null],
            contractLength: [null]
        })
        this.activeRoute.paramMap.subscribe(paramMap => {
            this.traineeId = paramMap.get('id') ? Number(paramMap.get('id')) : undefined
            if (this.traineeId) {
                this.traineeService.getDetail(this.traineeId).subscribe(res => {
                    this.validateForm.patchValue({...res.data})
                })
            }
        })
        // @ts-ignore
        this.validateForm.get('salary').valueChanges.subscribe(value => {
            if (value === true) {
                // @ts-ignore
                this.validateForm.get('allowanceGroup').enable();
                // @ts-ignore
                this.validateForm.get('tpbAccount').enable();
                // @ts-ignore
                this.validateForm.get('contractLength').enable();
                // @ts-ignore
                this.validateForm.get('contractStartDate').enable();
            } else {
                // @ts-ignore
                this.validateForm.get('allowanceGroup').disable();
                this.validateForm.get('allowanceGroup')?.clearValidators();
                // @ts-ignore
                this.validateForm.get('tpbAccount').disable();
                // @ts-ignore
                this.validateForm.get('contractLength').disable();
                // @ts-ignore
                this.validateForm.get('contractStartDate').disable();
            }
        })
    }

    /**
     * @author <a href="mailto:mr.doantheson@gmail.com"> SonDT21
     * <p>
     * This function is used to submit the form data to create or update a trainee
     */
    submitForm() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty()
            this.validateForm.controls[i].updateValueAndValidity()
        }
        if (this.validateForm.invalid) {
            return
        }
        if (this.validateForm.value.phone) {
            this.validateForm.value.phone = this.validateForm.value.phone.startsWith('+') ? '0' +
                this.validateForm.value.phone.substring(3).trim() : this.validateForm.value.phone;
            this.validateForm.value.phone = this.validateForm.value.phone.trim();
        }
        const payLoad = this.validateForm.value
        if (this.traineeId) {
            this.traineeService.update(payLoad, this.traineeId).subscribe(
                res => {
                    this.submitUpdateSuccess('Update trainee successfully')
                })
        } else {
            this.traineeService.create(payLoad).subscribe(() => {
                    this.submitSuccess('Create trainee successfully')
                }
            )
        }
    }

    submitSuccess(message: string) {
        this.message.success(message)
        this.router.navigate(["app/fa-trainee"])
    }

    submitUpdateSuccess(message: string) {
        this.message.success(message)
        this.router.navigate(["app/fa-trainee/" + this.traineeId])
    }

    loadUniversity(): void {
        this.universeService.getAll().subscribe(res => this.universityList = res.data)
    }

    loadFaculty(): void {
        this.facultyService.getAll().subscribe(res => this.facultyList = res.data)
    }

    formatter(value: number): string {
        return value <= 1 ? `${value} Month` : `${value} Months`;
    }

}
