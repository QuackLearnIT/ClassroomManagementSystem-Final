import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {LocalStorageUtils} from "../../utilities/local-storage.utils";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    validateForm!: UntypedFormGroup;

    constructor(private fb: UntypedFormBuilder,
                private authenticationService: AuthenticationService,
                private router: Router,
                private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
        });
    }

    submitForm(): void {
        if (this.validateForm.valid) {
            const payload = this.validateForm.value;
            this.authenticationService.login(payload).subscribe({
                next: res => {
                    // Save token to local storage
                    LocalStorageUtils.saveAccessToken(res.accessToken);
                    LocalStorageUtils.saveRefreshToken(res.refreshToken);
                    LocalStorageUtils.saveRole(res.role);
                    LocalStorageUtils.saveUserName(res.username);
                    // FIXME: Check role before navigate
                    this.router.navigate(['/app/fa-class']);
                },
                error: err => {
                    this.message.error('Username or password invalid, please try again!');
                }
            })
        } else {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
        }
    }

}
