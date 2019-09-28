import { Request } from "sandrasoft";
import { IRecord } from "../models/record/interface/IRecord";

const gateway = require('../../../gateway.json');
const ApiGateway = process.env.NODE_ENV === 'Local' ? gateway.local : gateway.dev;
const ApiRecord = ApiGateway.RecordService;

export class RecordGateway {
    static async getById(_recordId: string, headers: Object): Promise<IRecord> {
        let url = `${ApiRecord}/get/${_recordId}`;
        let result: any = await Request.get({ url, headers });
        if (!result || result.error) {
            throw new Error(`Api request for ${url} failed!`);
        }
        return result && result.body;
    }
}