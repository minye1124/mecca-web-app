export type AuthUser = {
    firstName: string;
    lastName: string;
    email: string;
};

export type AuthSessionPayload = {
    user: AuthUser;
    token: string;
};