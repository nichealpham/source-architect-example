import { IRecordCategory } from './IRecordCategory';

export interface IRecordLookup {
    _id: string,
    name: string,

    size: number,
    extension: string,
    signalDuration: number,
    samplingFrequency: number,

    categories: IRecordCategory[],
    keywords: string[],

    _userId: string,
    createdAt: Date,
}