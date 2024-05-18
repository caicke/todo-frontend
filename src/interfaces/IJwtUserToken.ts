export interface IJwtUserToken {
    sub: string | undefined;
    email: string;
    exp: number;
    fullName: string;
    iat: number;
}