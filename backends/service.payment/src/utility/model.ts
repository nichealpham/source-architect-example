import * as validators from './validator';
import { CommonFunctions } from './common';

export class LoopbackModelSetup {
    static async setup(app: any, modelName: string) {
        let model = app.models[modelName];
        if (model && model.sharedClass) {
            // Remove
            var methodsHides = [
                'patchOrCreate',
                'replaceOrCreate',
                'upsertWithWhere',
                'findOne',
                'updateAll',
                'patchAttributes',
                'createChangeStream',
                'create',
                'findById',
                'deleteById',
                'replaceById',
                'find',
                'destroyById'
            ];
            // Remove '__get__'
            var relation_methods = [
                '__findById__',
                '__destroyById__',
                '__updateById__',
                '__exists__',
                '__link__',
                '__create__',
                '__update__',
                '__destroy__',
                '__unlink__',
                '__count__',
                '__delete__'
            ];
            var methods = model.sharedClass.methods();
            var relationMethods = [];
            var hiddenMethods = [];
            var mutationList = [];
    
            Object.keys(model.definition.settings.relations).forEach(function (relation) {
                relation_methods.forEach(function (sub_method) {
                    relationMethods.push({name: sub_method + relation, isStatic: false});
                });
            });
    
            methods.forEach(function (method) {
                if (methodsHides.indexOf(method.name) > 0) {
                    hiddenMethods.push(method.name);
                    model.disableRemoteMethodByName(method.name, true);
                    model.disableRemoteMethodByName(method.name, false);
                }
            });
    
            relationMethods.forEach(function (method) {
                hiddenMethods.push(method.name);
                model.disableRemoteMethodByName(method.name, method.isStatic);
            });
            
            Object.keys(model.definition.properties).map(function (propertyName, index) {
                let property = model.definition.properties[propertyName];
                // Validate in array
                if (property.in) {
                    let list = property.in;
                    // Validate in array first
                    model.validatesInclusionOf(propertyName, { in: Object.keys(list) });
                    // Check if mutations is also available
                    if (model.definition.mutations && model.definition.mutations[propertyName]) {
                        mutationList.push({
                            propertyName,
                            configuration: model.definition.mutations[propertyName]
                        });
                    }
                }
                // Custom validtors
                if (property.validations && property.validations.length) {
                    for (let validatorName of property.validations) {
                        if (!validators[validatorName]) {
                            continue;
                        }
                        let customValidator = function(error) {
                            let value = this[propertyName];
                            let isCorrect = validators[validatorName](value);
                            if (!isCorrect) {
                                error();
                            }
                        }
                        model.validate(propertyName, customValidator, { message: `Field ${propertyName} is not a valid ${validatorName}` });
                    }
                }
            });

            model.observe('access', function (ctx: any, next: any) {
                CommonFunctions.accessSearch(model, ctx, function (new_ctx: any) {
                    ctx = new_ctx;
                    next();
                });
            });

            // Validate mutationList
            model.observe('before save', function (ctx: any, next: any) {
                let newData = ctx.instance || ctx.data;
                if (newData._id && mutationList.length) {
                    model.findById(newData._id, (error: Error, oldData: any) => {
                        if (oldData) {
                            let properties = Object.keys(model.definition.properties);
                            let diff = CommonFunctions.compareObjects(oldData, newData, properties);
                            for (let mutation of mutationList) {
                                let propertyName = mutation.propertyName;
                                if (!diff[propertyName]) {
                                    continue;
                                }
                                let oldValue = oldData[propertyName];
                                let newValue = newData[propertyName];
                                let permittedValues = mutation.configuration[oldValue];
                                if (!permittedValues || !permittedValues.includes(newValue)) {
                                    error = CommonFunctions.systemError('PROTECTED_FIELD_NOT_VALID');
                                }
                            }
                        }
                        next(error, newData);
                    });
                }
                else {
                    next();
                }
            });
        }
    }

    static async addBaseAPIs(app: any, modelName: string) {
        let model = app.models[modelName];
    
        if (!model.apiFind) {
            model.apiFind = async(filter: Object, ctx: any) => {
                return await model.find(filter);
            }
            CommonFunctions.setRemoting(model, 'apiFind', {
                description: 'Find all instances of the model matched by filter from the data source.',
                accessType: 'READ',
                accepts: [
                    { arg: 'filter', type: 'object', 
                        description: 'Filter defining fields, where, include, order, offset, and limit - must be a ' +
                        'JSON-encoded string ({"something":"value"})'
                    },
                    { arg: "ctx", type: "Object", http: { "source": "context" } }
                ],
                returns: { arg: 'data', type: `[${modelName}]`, root: false },
                http: { verb: 'get', path: '/' },
                rest: { after: CommonFunctions.convertNullToNotFoundError },
            });
        }
        
        if (!model.apiFindById) {
            model.apiFindById = async(_id: string, filter: Object, ctx: any) => {
                return await model.findById(_id, filter);
            }
            CommonFunctions.setRemoting(model, 'apiFindById', {
                description: 'Find a model instance by {{_id}} from the data source.',
                accessType: 'READ',
                accepts: [
                    { arg: '_id', type: 'string', description: 'Model Id', required: true, http: {source: 'path'} },
                    { arg: 'filter', type: 'object',
                        description:
                        'Filter defining fields and include - must be a JSON-encoded string (' +
                        '{"something":"value"})'
                    },
                    { arg: "ctx", type: "Object", http: { "source": "context" } }
                ],
                returns: { arg: 'data', type: `${modelName}`, root: false },
                http: { verb: 'get', path: '/:_id' },
                rest: { after: CommonFunctions.convertNullToNotFoundError },
            });
        }
    
        if (!model.apiCreate) {
            model.apiCreate = async(data: Object, ctx: any) => {
                return await model.create(data);
            }
            CommonFunctions.setRemoting(model, 'apiCreate', {
                description: 'Create a new instance of the model and persist it into the data source.',
                accessType: 'WRITE',
                accepts: [
                  {
                    arg: 'data', type: 'object', model: `${modelName}`, allowArray: true,
                    description: 'Model instance data',
                    http: {source: 'body'},
                  },
                  { arg: "ctx", type: "Object", http: { "source": "context" } }
                ],
                returns: { arg: 'data', type: `${modelName}`, root: false },
                http: { verb: 'post', path: '/' },
                rest: { after: CommonFunctions.convertNullToNotFoundError },
            });
        }
    
        if (!model.apiReplaceById) {
            model.apiReplaceById = async(_id: string, data: Object, ctx: any) => {
                return await model.replaceById(_id, data);
            }
            CommonFunctions.setRemoting(model, 'apiReplaceById', {
                description: 'Update an instance of the model and persist it into the data source.',
                accessType: '*',
                accepts: [
                    { 
                        arg: '_id', type: 'string', description: 'Model Id', required: true,
                        http: { source: 'path' }},
                    {
                        arg: 'data', type: 'object', model: `${modelName}`, allowArray: false,
                        description: 'Model instance data',
                        http: { source: 'body' },
                    },
                    { arg: "ctx", type: "Object", http: { "source": "context" } }
                ],
                returns: { arg: 'data', type: `${modelName}`, root: false },
                http: { verb: 'put', path: '/:_id' },
                rest: { after: CommonFunctions.convertNullToNotFoundError },
            });
        }
        
    
        if (!model.apiDestroyById) {
            model.apiDestroyById = async(_id: string, ctx: any) => {
                let instance = await model.findById(_id);
                if (!instance) {
                    return { count: 0 };
                }
                let relations = CommonFunctions.filterHasMany(model);
                if (relations && relations.length) {
                    relations.forEach(async relationName => {
                        let dependentInstances = await instance[relationName].find({ where: {}});
                        if (dependentInstances && dependentInstances.length) {
                            dependentInstances.forEach(async dependentInstance => {
                                await dependentInstance.destroy();
                            });
                        }
                    });
                }
                return await model.destroyById(_id);
            }
            CommonFunctions.setRemoting(model, 'apiDestroyById', {
                description: 'Delete an instance of the model and persist it into the data source.',
                accessType: '*',
                accepts: [
                    {
                        arg: '_id', type: 'string', description: 'Model Id', required: true,
                        http: { source: 'path' }
                    },
                    { arg: "ctx", type: "Object", http: { "source": "context" } }
                ],
                returns: { arg: 'data', type: `${modelName}`, root: false },
                http: { verb: 'delete', path: '/:_id' },
                rest: { after: CommonFunctions.convertNullToNotFoundError },
            });
        }
    }
}