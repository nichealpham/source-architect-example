import { IRecordFileInfo } from "./IRecordFileInfo";

export interface IRecordCreate {
    name: string,
    dataUrl: string,
    fileInfo: IRecordFileInfo,
    _userId: string,
    createdAt: Date,
}