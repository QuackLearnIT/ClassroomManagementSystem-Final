import {RoleEnum} from "../enum/Role.enum";

export const MENU_ITEMS = [
    {
        name: 'Class Management',
        roles: [RoleEnum.DELIVERY_MANAGER, RoleEnum.FA_MANAGER, RoleEnum.RECRUITER, RoleEnum.SYSTEM_ADMIN, RoleEnum.CLASS_ADMIN, RoleEnum.TRAINER],
        router: '/app/fa-class',
    },
    {
        name: 'Trainee Management',
        roles: [RoleEnum.DELIVERY_MANAGER, RoleEnum.FA_MANAGER, RoleEnum.TRAINER, RoleEnum.RECRUITER, RoleEnum.SYSTEM_ADMIN, RoleEnum.CLASS_ADMIN],
        router: '/app/fa-trainee',
    },
    {
        name: 'Class Listing',
        roles: [RoleEnum.TRAINEE],
        router: '/app/fa-class',
    },
    {
        name: 'Trainee Profile',
        roles: [RoleEnum.TRAINEE],
        router: '/app/fa-trainee/profile',
    }
]
