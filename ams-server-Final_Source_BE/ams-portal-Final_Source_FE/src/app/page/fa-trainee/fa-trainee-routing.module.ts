import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FaTraineeListingComponent} from "./fa-trainee-listing/fa-trainee-listing.component";
import {FaTraineeFormComponent} from "./fa-trainee-form/fa-trainee-form.component";
import {FaTraineeDetailComponent} from "./fa-trainee-detail/fa-trainee-detail.component";

const routes: Routes = [
    {path: '', component: FaTraineeListingComponent},
    {path: 'list', component: FaTraineeListingComponent},
    {path: 'add', component: FaTraineeFormComponent, data: {customBreadcrumb: 'Create'}},
    {path: ':id', component: FaTraineeDetailComponent, data: {customBreadcrumb: 'Trainee Detail'}},
    {path: 'update/:id', component: FaTraineeFormComponent, data: {customBreadcrumb: 'Update'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FaTraineeRoutingModule {
}
