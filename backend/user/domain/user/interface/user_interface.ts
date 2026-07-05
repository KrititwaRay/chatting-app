export interface ILogin {
    email: string;
    name: string;
}

export interface IVerifyUser {
    email: string;
    otp: string;
}

export interface ILoginUser {
    _id: string;
    iat: number;
    exp: number

}