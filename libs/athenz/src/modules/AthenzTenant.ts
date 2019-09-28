const athenz = require('@yj-intl/athenz-nodejs-client');
const moment = require('moment-timezone');
import { privateKeyDir, authConfig } from '../constant';
import { AuthConfig } from '../interfaces/AuthConfig';
import { logger } from '../../logger';
import * as ramda from 'ramda';
import * as path from 'path';
import * as fs from 'fs';

const cachedTokens: {
    [tokenId: string]: {
        token: string,
        expireTime: Date,
    }
} = {};

export class AthenzTenant {
    domainName: string;
    serviceName: string;
    keyId: string;
    privateKey: string;
    authConfig: AuthConfig;

    constructor(domainName: string, serviceName: string, keyId: string, privateKeyBase64: string) {
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
    }

    async getRoleToken(targetDomain: string, targetRole: string): Promise<string> {
        const tokenId = `${targetDomain}.${targetRole}`;
        const expireTime: any = ramda.path([tokenId, 'expireTime'], cachedTokens);
        if (expireTime && expireTime.isAfter(moment())) {
            return cachedTokens[tokenId].token;
        }
        const token = await this.getFreshRoleToken(targetDomain, targetRole);
        if (token) {
            cachedTokens[tokenId] = {
                token,
                expireTime: moment().add(1, 'hour'),
            };
        }
        return token;
    }

    private async getFreshRoleToken(targetDomain: string, targetRole: string): Promise<string> {
        athenz.RoleTokenClient.setConfig(this.authConfig);
        const initParams = {
            domainName: this.domainName,
            serviceName: this.serviceName,
            keyID: this.keyId,
            privateKey: this.privateKey,
        };
    
        const RoleTokenClient = new athenz.RoleTokenClient(initParams);
        const params = {
            domainName: targetDomain,
            roleName: targetRole,
            minExpiryTime: 3600,
        };
    
        return new Promise<string>((resolve) => {
            RoleTokenClient.getRoleToken(params, function(err: Error, res: {token: string}) {
                if (err) {
                    logger.critical(`ServiceRoleToken getFreshToken Error`);
                    logger.debug(`Error message: ${err.message}`);
                    resolve('');
                }
                resolve(res && res.token);
            });
        });
    }
}

