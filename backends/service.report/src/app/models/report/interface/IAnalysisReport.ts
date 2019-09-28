export interface IAnalysisReport {
    _id: string,
    _userId: string,
    _recordId: string,
    template: string,
    data: any,
    createdAt: Date,
}