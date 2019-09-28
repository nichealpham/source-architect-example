import { Server, ServerConfig, ServerRoute } from 'sandrasoft';
import { validateUserLoggedIn } from './validator';
import { Request } from 'express';
import { IUserAuthentication } from './app/models/user/interface/IUserAuthentication';
import { fieldsParser } from './lib/helper/fieldParser';
import { WaveformService } from './app/services/WaveformService';
import * as path from 'path';

const config: ServerConfig = {
    apiRoot: "/stream",
    port: Number(process.env.PORT) || 4007,
    remoting: {
        cors: {
            origin: "*",
            optionsSuccessStatus: 200
        },
        json: {
            strict: true,
            limit: '200mb',
        },
        logger: {
            logFilePath: path.join(__dirname, 'stream.log.txt'),
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
            convertNullToError: true
        }
    }
}
const server = new Server(config);
server.applyMiddleware(validateUserLoggedIn);

const routes: { [key: string]: ServerRoute } = {
    getWaveforms: {
        method: 'GET',
        paths: [
            '/waveform/get/:_recordId',
        ],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            recordId: req.params._recordId,
            query: req.query,
        }),
        serviceHandler: async (input: { userAuthen: IUserAuthentication, recordId: string, query: any }) => {
            const { userAuthen, recordId, query } = input;
            fieldsParser(query);

            let start = query.start || 0;
            let limit = query.limit || 1000;

            return await WaveformService.getWaveforms(recordId, start, limit, userAuthen);
        },
    },
    deleteWaveforms: {
        method: 'DELETE',
        paths: [
            '/waveform/delete/:_recordId',
        ],
        prepareInput: (req: Request) => ({
            userAuthen: req.userAuthen,
            recordId: req.params._recordId,
        }),
        serviceHandler: async (input: { userAuthen: IUserAuthentication, recordId: string }) => {
            const { userAuthen, recordId } = input;
            return WaveformService.delete(recordId, userAuthen._id);
        },
    }
}

server.applyRoutes(routes);
server.startListening();