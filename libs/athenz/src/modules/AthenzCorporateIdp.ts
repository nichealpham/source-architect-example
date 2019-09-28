const athenz = require('@yj-intl/athenz-nodejs-client');
import { Request, Response, NextFunction } from 'express';
import { privateKeyDir, authConfig, defaultCorporateRoles } from '../constant';
import { AuthConfig } from '../interfaces/AuthConfig';
import * as R from 'ramda';
import * as fs from 'fs';
import * as path from 'path';
import * as createError from 'http-errors';

export class AthenzCorporateIdp {
    domainName: string;
    serviceName: string;
    keyId: string;
    privateKey: string;
    privateKeyPath: string;
    authConfig: AuthConfig;
    corporateRoles: string[];

    constructor(domainName: string, serviceName: string, keyId: string, privateKeyBase64: string, useDevZcs = false) {
        const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
        const privateKeyPath = path.join(privateKeyDir, `${domainName}.${serviceName}.private.key`);
        fs.writeFileSync(privateKeyPath, privateKey);
        this.authConfig = JSON.parse(JSON.stringify(authConfig));
        this.authConfig.accessTokenAuthClient.keyID = keyId;
        this.authConfig.accessTokenAuthClient.privateKeyPath = privateKeyPath;
        this.domainName = domainName;
        this.serviceName = serviceName;
        this.keyId = keyId;
        this.privateKey = privateKey;
        this.privateKeyPath = privateKeyPath;
        this.corporateRoles = defaultCorporateRoles;
        if (useDevZcs) {
            this.authConfig.accessTokenAuthClient.zcs = 'https://dev.zcs.athenz.yahoo.co.jp/zcs/v1';
        }
    }

    configRolesLevel(roles: string[]) {
        if (R.isEmpty(roles)) {
            return;
        }
        this.corporateRoles = roles;
    }

    requireCorporateLogin() {
        athenz.AccessTokenAuthClient.setConfig(this.authConfig);
        const corporateAuthParams = {
            domainName: this.domainName,
            serviceName: this.serviceName,
            keyID: this.keyId,
            privateKey: this.privateKey,
            privateKeyPath: this.privateKeyPath,
        };
        // Get user role object basing on headers
        const roleFns: any = this.corporateRoles.map(
            roleName => [R.any(R.contains(roleName)), R.always(roleName)]
        );
        const getRole = R.cond([
            ...roleFns,
            [R.T, R.always(null)],
        ]);
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                athenz.AccessTokenAuthClient.allowAccessOnExpressParams(corporateAuthParams, req, res, (err: Error, result: any) => {
                    if (err) {
                        return next(createError(403, err));
                    }
                    const {userID, userName, userRoles} = result;
                    if (!userID || !userName || !userRoles) {
                        return next(createError(403, 'Insufficient user data retrieved from Athenz system.'));
                    }
                    const role = getRole(userRoles);
                    req['loginUser'] = {
                        id: userID,
                        name: userName,
                        userRoles,
                        role,
                        isEditor: role.includes('editor'),
                        isViewer: role.includes('viewer'),
                        isYG: !role.includes('not_y'),
                    };
                    return next();
                });
            } catch (err) {
                logger.critical(`CorporateIdpMiddleware apply error`);
                logger.debug(err);
                return next(createError(403, err));
            }
        };
    }
}