import {NgModule} from '@angular/core';

import {FaClassRoutingModule} from './fa-class-routing.module';
import {FaClassListingComponent} from './fa-class-listing/fa-class-listing.component';
import {SharedModule} from '../../shared/shared.module';
import {FaClassFormComponent} from './fa-class-form/fa-class-form.component';
import {FaClassViewComponent} from './fa-class-view/fa-class-view.component';
import {FaTraineeInClassComponent} from './fa-trainee-in-class/fa-trainee-in-class.component';
import {FaTraineeModule} from "../fa-trainee/fa-trainee.module";

@NgModule({
    declarations: [
        FaClassListingComponent,
        FaClassFormComponent,
        FaClassViewComponent,
        FaTraineeInClassComponent,
    ],
    imports: [SharedModule, FaClassRoutingModule, FaTraineeModule],
})
export class FaClassModule {
}
