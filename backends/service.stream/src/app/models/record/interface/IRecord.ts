export interface IRecord {
    _id: string,
    name: string,
    dataUrl: string,

    fileInfo: IRecordFileInfo,
    analysis?: IRecordAnalysis,

    _userId: string,
    createdAt: Date,
}

interface IRecordCategory {
    value: string,
    confidenceLevel: number,
}

interface IRecordAnalysis {
    total: number,
    categories: IRecordCategory[],
    modelConfidenceLevel: number,
    executionTime: number,
    createdAt: Date,
}

interface IRecordFileInfo {
    encoding: string,
    mimetype: string,
    size: number,
    extension: string,
    samplingFrequency: number,
    analysisInterval: number,
    dataColumns: number[],
    storagePath: string,
}