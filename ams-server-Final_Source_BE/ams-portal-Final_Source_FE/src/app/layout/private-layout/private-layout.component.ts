import {Component} from '@angular/core';
import {MENU_ITEMS} from "../../common/menu-item";
import {RoleEnum} from "../../enum/Role.enum";
import {LocalStorageUtils} from "../../utilities/local-storage.utils";
import {AuthenticationService} from "../../service/authentication.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-private-layout',
    templateUrl: './private-layout.component.html',
    styleUrls: ['./private-layout.component.scss']
})
export class PrivateLayoutComponent {
    constructor(private authenticationService: AuthenticationService,
                private router: Router) {}

    logout(): void {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    MENU_ITEMS = MENU_ITEMS
        .filter(item => item.roles.length === 0
            || item.roles.includes(localStorage.getItem('roles') as RoleEnum));

    isPermitToUpdate(): boolean {
        return LocalStorageUtils.getRole() !== RoleEnum.TRAINEE
    }
}
