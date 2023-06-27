export class LocalStorageUtils {

    static removeLoginInfo() {
        localStorage.clear();
    }

    static saveProfile(profile: any) {
        LocalStorageUtils.saveValue('profile', profile);
    }

    static saveRefreshToken(refreshToken: string) {
        if (!refreshToken) {
            return;
        }
        LocalStorageUtils.saveValue('refresh_token', refreshToken);
    }

    static saveUserName(displayName: string) {
        LocalStorageUtils.saveValue('user_name', displayName);
    }

    static saveAccessToken(accessToken: string) {
        LocalStorageUtils.saveValue('access_token', accessToken);
    }

    static getUserName() {
        return localStorage.getItem('user_name');
    }

    static getAccessToken() {
        return localStorage.getItem('access_token');
    }

    static getProfile() {
        return localStorage.getItem('profile');
    }

    static saveRole(role: string) {
        LocalStorageUtils.saveValue('roles', role);
    }

    static getRole() {
        return LocalStorageUtils.getItem('roles');
    }

    static getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    static saveValue(key: string, value: any) {
        if (!value) {
            return;
        }
        localStorage.setItem(key, value);
    }

    static getItem(key: string) {
        return localStorage.getItem(key);
    }
}
