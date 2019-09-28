import { Request } from "sandrasoft";

const gateway = require('../../../gateway.json');
const ApiGateway = process.env.NODE_ENV === 'Local' ? gateway.local : gateway.dev;
const ApiRecord = ApiGateway.RecordService;

export class RecordGateway {
    static async getRecordById(_recordId: string, headers: Object) {
        let url = `${ApiRecord}/get/${_recordId}`;
        const result: any = await Request.get({ url, headers });
        if (!result || result.error) {
            throw new Error(`Api request for ${url} failed!`);
        }
        return result && result.body;
    }
}