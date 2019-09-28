import { IRecordFileInfo } from "./IRecordFileInfo";
import { IRecordAnalysis } from "./IRecordAnalysis";

export interface IRecordUpdate {
    name?: string,
    dataUrl?: string,

    fileInfo?: IRecordFileInfo,
    analysis?: IRecordAnalysis,
}