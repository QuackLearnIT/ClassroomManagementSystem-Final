import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaTraineeRoutingModule } from './fa-trainee-routing.module';
import { FaTraineeListingComponent } from './fa-trainee-listing/fa-trainee-listing.component';
import {SharedModule} from "../../shared/shared.module";
import {FaTraineeFormComponent} from "./fa-trainee-form/fa-trainee-form.component";
import {FaTraineeDetailComponent} from "./fa-trainee-detail/fa-trainee-detail.component";


@NgModule({
    declarations: [
        FaTraineeListingComponent,
        FaTraineeFormComponent,
        FaTraineeDetailComponent

    ],
    exports: [
        FaTraineeListingComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FaTraineeRoutingModule
    ]
})
export class FaTraineeModule { }
