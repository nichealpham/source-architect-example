import { SwaggerSetup, ISwaggerOption } from "../utility/swagger";

export default (app: any) => {
    let option: ISwaggerOption = {
        swaggerUrl: '/explorer',
        jsonFileName: 'swagger.json',
        enableSwaggerUI: true,
    };
    let overide = {
        info: {
            title: `Payment Service APIs`,
            description: `This is a service for handling payment methods for cassandra.ml`,
        },
        definitions: {},
    };
    SwaggerSetup.setup(app, option, overide);
}