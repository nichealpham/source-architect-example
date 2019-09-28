import { athenzUtilPath, zpuConfDir, policyDir, athenzMode } from '../constant';
import { logger } from '../../logger';
import { CronJob } from 'cron';
import { exec } from 'child_process';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

const cronDomainPolicies = (domainName: string) => {
    if (os.platform() === 'win32') {
        return false;
    }
    const zpuConfFile = path.join(zpuConfDir, `${domainName}.conf`);
    const zpuConfFileData = {
        domains: domainName,
        policyDir,
    };
    const zpu = os.platform() === 'darwin' ? 'zpu-darwin' : 'zpu';
    try {
        // create zpu conf directory
        fs.mkdirSync(zpuConfDir, {recursive: true});
        logger.debug(`mkdir ${zpuConfDir} success !`);

        // create policy directory
        fs.mkdirSync(policyDir, {recursive: true});
        logger.debug(`mkdir ${policyDir} success !`);

        // create zpe_stat directory
        fs.mkdirSync(path.join(athenzUtilPath, 'var'), {recursive: true});
        fs.mkdirSync(path.join(athenzUtilPath, 'var/zpe_stat'), {recursive: true});
        logger.debug('mkdir var/zpe_stat success !');

        fs.writeFileSync(zpuConfFile, JSON.stringify(zpuConfFileData));
        logger.debug(`write file ${zpuConfFile} success :` + JSON.stringify(zpuConfFileData));

        return new CronJob('0 */15 * * * *', () => {
            const dir = athenzUtilPath;
            const cmd = `ROOT=${dir} ${dir}/bin/${zpu} -athenzConf ${dir}/config/${athenzMode}.conf -logFile ${dir}/zpu.log -zpuConf ${dir}/conf/${domainName}.conf && tail -n 5 ${dir}/zpu.log`; // eslint-disable-line
            exec(cmd, (error, stdout) => {
                if (error) {
                    fs.readFile(`${dir}/conf/${domainName}.conf`, 'utf8', (err, data) => {
                        if (err) {
                            logger.critical(`Error readFile ${dir}/conf/${domainName}.conf !` + err.message); // eslint-disable-line
                        } else {
                            logger.debug('zpuConf: ' + data.toString());
                        }
                    });
                    fs.readFile(`${dir}/pol/${domainName}.pol`, 'utf8', (err, data) => {
                        if (err) {
                            logger.critical(`Error readFile ${dir}/pol/${domainName}.pol !` + err.message); // eslint-disable-line
                        } else {
                            logger.debug('Policy: ' + data.toString());
                        }
                    });
                    logger.critical(`(ATHENZ CRON) ERROR cron. exec ${cmd} stdout: ${stdout}, error: ${error}`); // eslint-disable-line
                } else {
                    stdout.split(/\r?\n/).forEach((element) => {
                        logger.debug(`stdout: ${element}`);
                    });
                    logger.info(`(ATHENZ CRON) Cron policies for domain ${domainName} success`);
                }
            });
        }, () => {}, true, undefined, null, true);
    } catch (err) {
        logger.critical(`##### cronDomainPolicies ERROR`);
        logger.critical(`Error Message: ${err.message.toString()}`);
        return false;
    }
};

export {
    cronDomainPolicies
};
