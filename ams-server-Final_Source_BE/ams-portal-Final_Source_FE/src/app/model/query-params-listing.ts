export interface QueryParamsListing {
    page: number,
    size: number,
    q?: string, // meaning ? option property
    sort?: string[] // meaning ? option property
    account?: string,
    fullName?: string,
    email?: string,
    dateOfBirth?: string,
    phone?: string,
    traineeStatus?: string,
    location?: string;
    classType?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    classStatus?: string;
}
