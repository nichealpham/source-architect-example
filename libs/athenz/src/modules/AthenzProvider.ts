const athenz = require('@yj-intl/athenz-nodejs-client');
import * as createError from 'http-errors';
import { roleTokenHeader, athenzMode, authConfig } from '../constant';
import { Request, Response, NextFunction } from 'express';
import { cronDomainPolicies } from './CronDomainPolicies';
import { AuthConfig } from '../interfaces/AuthConfig';
import { logger } from '../../logger';

export class AthenzProvider {
    domainName: string;
    athenzMode: string;
    authConfig: AuthConfig;

    constructor(domainName: string) {
        this.domainName = domainName;
        this.athenzMode = athenzMode;
        this.authConfig = JSON.parse(JSON.stringify(authConfig));
        cronDomainPolicies(this.domainName);
    }

    validateResource(resource: string, action = '*') {
        athenz.RoleAuthClient.setConfig(this.authConfig);
        return async (req: Request, res: Response, next: NextFunction) => {
            const roleToken = req.header(roleTokenHeader);
            try {
                const accessCheckStatus = await athenz.RoleAuthClient.allowAccess({
                    roleToken,
                    resource,
                    action,
                }).toPromise();
                if (accessCheckStatus !== athenz.RoleAuthClient.AccessCheckStatus.ALLOW) {
                    return next(createError(403, new Error('Unauthorized service')));
                }
                return next();
            } catch (err) {
                logger.critical(`AthenzApp.apply Error: ${err}`);
                return next(createError(403, `Invalid params. ${err}`));
            }
        };
    }
}