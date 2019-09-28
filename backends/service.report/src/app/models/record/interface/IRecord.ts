import { IRecordAnalysis } from './IRecordAnalysis';
import { IRecordFileInfo } from "./IRecordFileInfo";

export interface IRecord {
    _id: string,
    name: string,
    dataUrl: string,

    fileInfo: IRecordFileInfo,
    analysis?: IRecordAnalysis,

    _userId: string,
    createdAt: Date,
}