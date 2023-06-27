import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LocalStorageUtils} from "../utilities/local-storage.utils";

export const authenticationGuard: CanActivateFn = (route, state) => {
  if (LocalStorageUtils.getAccessToken()) {
    return true;
  }
  const router: Router = inject(Router);
  router.navigate(['/login']);
  return false;
};
