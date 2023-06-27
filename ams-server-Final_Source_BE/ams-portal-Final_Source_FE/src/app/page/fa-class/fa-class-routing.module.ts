import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FaClassListingComponent} from './fa-class-listing/fa-class-listing.component';
import {FaClassFormComponent} from './fa-class-form/fa-class-form.component';
import {FaClassViewComponent} from './fa-class-view/fa-class-view.component';

const routes: Routes = [
    {path: '', component: FaClassListingComponent},
    {path: 'list', component: FaClassListingComponent},
    {path: 'add', component: FaClassFormComponent, data: {customBreadcrumb: 'Create'}},
    {path: 'view/:id', component: FaClassViewComponent},
    {path: 'update/:id', component: FaClassFormComponent, data: {customBreadcrumb: 'Update'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FaClassRoutingModule {
}
