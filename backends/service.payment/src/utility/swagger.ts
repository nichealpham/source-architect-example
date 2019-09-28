import { Request, Response } from 'express';
let swaggerUi = require('swagger-ui-express');
let loopbackSwagger = require('loopback-swagger');

export class SwaggerSetup {
    static setup(app: any, option: ISwaggerOption, specOveride: any = {}) {
        let options = {
            resourcePath: option.jsonFileName,
            swaggerUI: option.enableSwaggerUI,
            apiInfo: app.get('apiInfo') || {},
        }
        let swaggerSpec = loopbackSwagger.generateSwaggerSpec(app, options);
        swaggerSpec = {...swaggerSpec, ...specOveride};
        
        let router = app.loopback.Router();
        router.get(`${option.swaggerUrl}/${option.jsonFileName}`, async (req: Request, res: Response) => {
            res.status(200).json(swaggerSpec);
        });
        router.use(`${option.swaggerUrl}`, swaggerUi.serve);
        router.get(`${option.swaggerUrl}`, (req: Request, res: Response) => {
            res.send(swaggerUi.generateHTML(swaggerSpec));
        });
        app.use(router);
    }
}

export interface ISwaggerOption {
    swaggerUrl: string,
    jsonFileName: string,
    enableSwaggerUI: boolean,
}