import { IRecordCategory } from './IRecordCategory';

export interface IRecordAnalysis {
    total: number,
    fileUrl: string,
    categories: IRecordCategory[],
    modelConfidenceLevel: number,
    executionTime: number,
    createdAt: Date,
}