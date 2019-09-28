import { Server, ServerConfig, ServerRoute } from 'sandrasoft';
import { allowSingleUploadMemory } from 'sandrasoft';
import { validateUserLoggedIn } from './validators';
import { UserRepository } from './resources/UserRepository';
import { UserRegister } from './models/UserRegister';
import { UserAuthentication } from './models/UserAuthentication';
import { UserAvatarStorage } from './resources/AvatarStorage';
import { IUserCreate } from './models/interface/IUserCreate';
import { IUserUpdate } from './models/interface/IUserUpdate';
import { Request } from 'express';
import * as path from 'path';

const config: ServerConfig = {
    apiRoot: "/user",
    port: Number(process.env.PORT) || 4001,
    remoting: {
        cors: {
            origin: "*",
            optionsSuccessStatus: 200
        },
        logger: {
            logFilePath: path.join(__dirname, 'user.log.txt'),
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

const routes: { [key: string]: ServerRoute } = {
    getUserById: {
        method: 'GET',
        paths: [
            '/:_id',
        ],
        middlewares: {
            requireUserLoggedIn: validateUserLoggedIn()
        },
        validations: {
            headers: {
                _uuid: ['!isEmpty'],
                authorization: ['!isEmpty']
            }
        },
        prepareInput: (req: Request) => ({
            userId: req.headers._uuid
        }),
        serviceHandler: async (input: { userId: string }) => {
            const { userId } = input;
            return await UserRepository.get(userId);
        },
    },
    registerNewUser: {
        method: 'POST',
        paths: [
            '/register',
        ],
        prepareInput: (req: Request) => ({
            userCreate: req.body
        }),
        serviceHandler: async (input: { userCreate: IUserCreate }) => {
            const { userCreate } = input;
            let userRegister = UserRegister.from(userCreate);
            return await UserRepository.create(userRegister);
        }
    },
    loginUser: {
        method: 'POST',
        paths: [
            '/login',
        ],
        validations: {
            body: {
                email: ['isEmail'],
                password: ['!isEmpty']
            }
        },
        prepareInput: (req: Request) => ({
            email: req.body.email,
            password: req.body.password
        }),
        serviceHandler: async (input: {email: string, password: string}) => {
            const { email, password } = input;
            let user = await UserRepository.findOne({
                query: {
                    email: email,
                    password: password
                }
            });
            if (!user) {
                return null;
            }
            return UserAuthentication.from(user);
        }
    },
    updateUser: {
        method: 'PUT',
        paths: [
            '/update/:_id',
        ],
        middlewares: {
            requireUserLoggedIn: validateUserLoggedIn()
        },
        validations: {
            headers: {
                _uuid: ['!isEmpty'],
                authorization: ['!isEmpty']
            }
        },
        prepareInput: (req: Request) => ({
            userId: req.headers._uuid,
            dataUpdate: req.body,
        }),
        serviceHandler: async (input: { userId: string, dataUpdate: IUserUpdate }) => {
            const { userId, dataUpdate } = input;
            return await UserRepository.update(userId, dataUpdate);
        }
    },
    updateUserPassword: {
        method: 'PUT',
        paths: [
            '/password/:_id',
        ],
        middlewares: {
            requireUserLoggedIn: validateUserLoggedIn()
        },
        validations: {
            headers: {
                _uuid: ['!isEmpty'],
                authorization: ['!isEmpty']
            }
        },
        prepareInput: (req: Request) => ({
            userId: req.headers._uuid,
            newPassword: req.body.password,
        }),
        serviceHandler: async (input: { userId: string, newPassword: string }) => {
            const { userId, newPassword } = input;
            return await UserRepository.update(userId, { password: newPassword });
        }
    },
    updateUserAvatar: {
        method: 'PUT',
        paths: [
            '/avatar/:_id'
        ],
        validations: {
            headers: {
                _uuid: ['!isEmpty'],
                authorization: ['!isEmpty']
            }
        },
        middlewares: {
            requireUserLoggedIn: validateUserLoggedIn(),
            allowAvatarUpload: allowSingleUploadMemory('fileUpload')
        },
        prepareInput: (req: Request) => ({
            userId: req.headers._uuid,
            file: req.file
        }),
        serviceHandler: async (input: {
            userId: string,
            file: {
                buffer: Buffer,
                mimetype: string
            }
        }) => {
            const { userId, file } = input;
            if (!file || !file.buffer || !file.mimetype) {
                throw new Error(`Request must attach with file!`);
            }
            let _id = userId;
            let buffer = file.buffer;
            let mimetype = file.mimetype;
    
            let user = await UserRepository.get(_id);
            if (!user) {
                throw new Error(`User with ${_id} does not exist!`);
            }
            let fileName = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}-avatar.${mimetype.split('/')[1]}`;
            let url = await UserAvatarStorage
                .uploadBuffer(fileName, buffer, true, 'no-cache, no-store, max-age=0', user.email, mimetype)
                .catch((err: Error) => {
                    throw new Error(`Cannot upload image at the moment. Error: ${err.toString()}`);
                }
            )
            url = await UserAvatarStorage
                .getDownloadUrl(fileName, user.email)
                .catch((err: Error) => {
                    throw new Error(`Cannot get download url of avatar. Error: ${err.toString()}`);
                }
            )
            await UserRepository.update(_id, { avatar: url });
            return url;
        },
    },
    deleteUser: {
        method: 'DELETE',
        paths: [
            '/delete/:_id',
        ],
        middlewares: {
            requireUserLoggedIn: validateUserLoggedIn(),
        },
        validations: {
            headers: {
                _uuid: ['!isEmpty'],
                authorization: ['!isEmpty']
            }
        },
        prepareInput: (req: Request) => ({
            userId: req.headers._uuid,
        }),
        serviceHandler: async (input: { userId: string }) => {
            const { userId } = input;
            return await UserRepository.delete(userId);
        }
    }
}

const server = new Server(config);
server.applyRoutes(routes);
server.startListening();