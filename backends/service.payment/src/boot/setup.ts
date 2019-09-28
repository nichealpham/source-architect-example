import { LoopbackModelSetup } from '../utility/model';

export default async (app: any) => {
    Object.keys(app.models).forEach(async modelName => {
        await LoopbackModelSetup.setup(app, modelName);
        if (app.models[modelName].settings.addBaseAPIs) {
            await LoopbackModelSetup.addBaseAPIs(app, modelName);
        }
    });
}


