import { CommonFunctions } from "../../utility/common";

let crypto = require('crypto');
let config = require(`./config.json`);

export default (Wallet: any) => {
    Wallet.apiGet = async (ctx: any) => {
        let _id = ctx.req.userAuthen._id;
        let pin = ctx.req.body.pin || ctx.req.query.pin || "";
        let wallet = await Wallet.findOne({
            where: {
                secrete_id: hash(_id, pin),
                _userId: ctx.req.userAuthen._id
            }
        });
        if (!wallet) {
            throw CommonFunctions.systemError('WALLET_NOT_EXISTED');
        }
        if (wallet.status !== 'activated') {
            throw CommonFunctions.systemError('WALLET_NOT_ACTIVATED');
        }
        return wallet;
    }

    Wallet.apiCreate = async (ctx: any) => {
        let { _id, email, accessToken } = ctx.req.userAuthen;
        let pin = ctx.req.body.pin || ctx.req.query.pin || "";
        let  secrete_id = hash(_id, pin)
        let wallet = await Wallet.findOne({
            where: {
                secrete_id,
                _userId: _id
            }
        });
        if (wallet) {
            throw CommonFunctions.systemError('WALLET_ALREADY_EXISTED');
        }
        wallet = await Wallet.create({ secrete_id, _userId: _id });
        let options = {
            activation_link: `${config.activation_url}?_uuid=${_id}&pin=${pin}&authorization=${accessToken}`
        }
        return await Wallet.app.models.Email.sendEmail('WalletActivation', email, options);
    }

    Wallet.apiActivate = async (ctx: any) => {
        let wallet = await Wallet.findOne({
            where: {
                secrete_id: hash(ctx.req.userAuthen._id, ctx.req.query.pin),
                _userId: ctx.req.userAuthen._id,
            }
        });
        if (!wallet) {
            return ctx.res.redirect(`${config.activation_failed_url}`);
        }
        wallet.status = 'activated';
        await wallet.save();
        return ctx.res.redirect(`${config.activation_success_url}`);
    }
}

function hash(val1: string, val2: string): string {
    let hashed1 = crypto.createHash('md5').update(val1.toString()).digest('hex');
    let hashed2 = crypto.createHash('md5').update(val2.toString()).digest('hex');
    return crypto.createHash('md5').update(hashed1 + hashed2).digest('hex');
}