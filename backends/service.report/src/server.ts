import { Server, ServerConfig, ServerRoute } from 'sandrasoft';
import { validateUserLoggedIn } from './validators';
import { IUserAuthentication } from './app/models/user/interface/IUserAuthentication';
import { ReportService } from './app/services/ReportService';
import { Request } from 'express';

import * as path from 'path';
import { IAnalysisReportUpdate } from './app/models/report/interface/IAnalysisReportUpdate';

const config: ServerConfig = {
    apiRoot: "/report",
    port: Number(process.env.PORT) || 4008,
    remoting: {
        cors: {
            origin: "*",
            optionsSuccessStatus: 200
        },
        json: {
            strict: true,
            limit: '250mb',
        },
        logger: {
            logFilePath: path.join(__dirname, 'report.log.txt'),
            timestampFormat: "",
        },
        rest: {
            errorHandler: {
                fieldName: "error",
                writeLog: true
            },
            successHandler: {
                fieldName: "body",
                writeLog: true
            },
            convertNullToError: false
        }
    }
}
const server = new Server(config);
server.applyMiddleware(validateUserLoggedIn);

const routes: { [key: string]: ServerRoute } = {
    getReportById: {
        method: 'GET',
        paths: ['/get/:_reportId'],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            reportId: req.params._reportId,
        }),
        serviceHandler: async (input: {userAuthen: IUserAuthentication, reportId: string}) => {
            const { userAuthen, reportId } = input;
            let report = await ReportService.get(reportId);
            if (!report) {
                throw new Error(`Report ${reportId} not exists!`);
            }
            if (report._userId !== userAuthen._id) {
                throw new Error(`Unauthorized to view this data!`);
            }
            return report;
        }
    },
    findReportByRecordId: {
        method: 'GET',
        paths: ['/find/:_recordId'],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            recordId: req.params._recordId,
        }),
        serviceHandler: async (input: {userAuthen: IUserAuthentication, recordId: string}) => {
            const { userAuthen, recordId } = input;
            let report = await ReportService.find(recordId, userAuthen._id);
            return report;
        }
    },
    updateReportByRecordId: {
        method: 'PUT',
        paths: ['/update/:_recordId'],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            recordId: req.params._recordId,
            dataUpdate: req.body,
        }),
        serviceHandler: async (input: {userAuthen: IUserAuthentication, recordId: string, dataUpdate: IAnalysisReportUpdate}) => {
            const { userAuthen, recordId, dataUpdate } = input;
            return await ReportService.update(userAuthen._id, recordId, dataUpdate);
        }
    },
    createReport: {
        method: 'POST',
        paths: ['/create/:_recordId'],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            recordId: req.params._recordId,
        }),
        serviceHandler: async (input: {userAuthen: IUserAuthentication, recordId: string}) => {
            const { userAuthen, recordId } = input;
            let data = {
                _recordId: recordId,
                _userId: userAuthen._id,
            };
            return await ReportService.create(userAuthen, data);
        }
    }
}
server.applyRoutes(routes);
server.startListening();