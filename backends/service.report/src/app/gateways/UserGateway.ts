import { Request } from "sandrasoft";

const gateway = require('../../../gateway.json');
const ApiGateway = process.env.NODE_ENV === 'Local' ? gateway.local : gateway.dev;
const ApiUser = ApiGateway.UserService;

export class UserGateway {
    static async getUserById(_userId: string, headers: Object) {
        let url = `${ApiUser}/${_userId}`;
        const result: any = await Request.get({ url, headers });
        if (!result || result.error) {
            throw new Error(`Api request for ${url} failed!`);
        }
        return result && result.body;
    }
}