export interface IRecordFileInfo {
    encoding: string,
    mimetype: string,
    size: number,
    extension: string,
    samplingFrequency: number,
    analysisInterval: number,
    dataColumns: number[],
    storagePath: string,
}