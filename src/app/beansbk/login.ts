
export interface Login {
    userId: string;
    password: string;
}

export interface ChangePassword {
    userId: string;
    oldPassword: string;
    newPassword: string;
    retypePaasword: string;
}
