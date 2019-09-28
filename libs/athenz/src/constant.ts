import * as path from 'path';
import { AuthConfig } from './interfaces/AuthConfig';

export const athenzMode = process.env.ATHENZ_MODE || 'production';
export const logLevel = process.env.CF_LOGGER_OUTPUT_LEVEL || 'info';
export const athenzUtilPath = path.join(__dirname, '/../../' , 'utils');
export const privateKeyDir = path.join(athenzUtilPath, 'keys');
export const zpuConfDir = path.join(athenzUtilPath, 'conf');
export const policyDir = path.join(athenzUtilPath, 'pol');
export const configDir = path.join(athenzUtilPath, 'config');
export const confFileName = path.join(athenzUtilPath, `config/${athenzMode}.conf`);

export const principalHeader = 'Yahoo-Principal-Auth';
export const roleTokenHeader = 'Yahoo-Role-Token';
export const authUserRoleHeader = 'X-Auth-UserRoles';
export const authUserNameHeader = 'X-Auth-UserName';
export const authUserIdHeader = 'X-Auth-UserID';

export const defaultCorporateRoles = [
    'editor',
    'viewer',
    'editor_not_y',
    'viewer_not_y',
];

export const authConfig: AuthConfig = {
    confFileName,
    authenticationOnly: true,
    auth_core: {
        logLevel,
        principalHeader,
    },
    ztsClient: {
        logLevel,
        zts: 'https://zts.athenz.yahoo.co.jp:4443/zts/v1',
        strictSSL: true,
        tokenMinExpiryTime: 900,
        tokenRefresh: 1800,
        disableCache: false,
    },
    zpeClient: {
        logLevel,
        policyDir,
        confFileName,
        policyRefresh: 1800,
    },
    accessTokenAuthClient: {
        logLevel,
        zcs: 'https://zcs.athenz.yahoo.co.jp/zcs/v1',
        accessTokenMaxAge: 28800,
        keyID: '',
        privateKeyPath: '',
    },
};