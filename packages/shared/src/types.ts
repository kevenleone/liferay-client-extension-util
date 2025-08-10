export type LiferayAuthorization = {
    authorization_code: string;
    client_id: string;
    code_verifier: string;
    exp: number;
    grant_type: string;
    iat: number;
    iss: string;
    jti: string;
    scope: string;
    sub: string;
    username: string;
};
