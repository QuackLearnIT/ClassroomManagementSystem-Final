import {Component, OnInit} from '@angular/core';
import {TraineeService} from "../../../service/trainee.service";
import {ActivatedRoute} from "@angular/router";
import {TraineeDetails} from "../../../model/trainee";
import {DATE_FORMAT} from "../../../common/const";
import {NzDescriptionsSize} from "ng-zorro-antd/descriptions";
import {LocalStorageUtils} from "../../../utilities/local-storage.utils";
import {RoleEnum} from "../../../enum/Role.enum";

@Component({
    selector: 'app-fa-trainee-detail',
    templateUrl: './fa-trainee-detail.component.html',
    styleUrls: ['./fa-trainee-detail.component.scss']
})
export class FaTraineeDetailComponent implements OnInit {
    traineeDetail: TraineeDetails = {}
    DATE_FORMAT = DATE_FORMAT
    id!: number | undefined
    size: NzDescriptionsSize = 'small'

    constructor(private traineeService: TraineeService,
                private activeRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.loadTraineeDetail()
    }

    loadTraineeDetail(): void {
        this.activeRoute.paramMap.subscribe(paramMap => {
            this.id = paramMap.get('id') ? Number(paramMap.get('id')) : undefined
            this.traineeService.getDetail(this.id).subscribe(res => {
                if (res.data) {
                    this.traineeDetail = res.data
                }
            })
        })
    }

    isPermitToUpdate(): boolean {
        return LocalStorageUtils.getRole() !== RoleEnum.TRAINEE
    }

}
