export interface AuthConfig {
    confFileName: string;
    authenticationOnly: boolean;
    auth_core: {
        logLevel: string,
        principalHeader: string,
    };
    ztsClient: {
        logLevel: string,
        zts: string,
        strictSSL: boolean,
        tokenMinExpiryTime: number,
        tokenRefresh: number,
        disableCache: boolean,
    };
    zpeClient: {
        logLevel: string,
        policyDir: string,
        confFileName: string,
        policyRefresh: number,
    };
    accessTokenAuthClient: {
        logLevel: string,
        zcs: string,
        accessTokenMaxAge: number,
        keyID: string,
        privateKeyPath: string,
    };
}