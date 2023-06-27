import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrivateLayoutComponent} from "./layout/private-layout/private-layout.component";
import {authenticationGuard} from "./guard/authentication.guard";

const routes: Routes = [
    {
        path: 'app',
        canActivate: [authenticationGuard],
        component: PrivateLayoutComponent,
        children: [
            {
                path: 'fa-class',
                loadChildren: () => import('./page/fa-class/fa-class.module').then(m => m.FaClassModule),
                data: {customBreadcrumb: 'Class Management'}
            },
            {
                path: 'fa-trainee',
                loadChildren: () => import('./page/fa-trainee/fa-trainee.module').then(m => m.FaTraineeModule),
                data: {customBreadcrumb: 'Trainee Management'}
            }
        ]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadChildren: () => import('./page/login/login.module').then(m => m.LoginModule)},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
