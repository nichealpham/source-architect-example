import { IRecordCategory } from './IRecordCategory';

export interface IRecordLookupUpdate {
    name?: string,
    samplingFrequency?: number,
    categories?: IRecordCategory[],
    keywords?: string[],
}