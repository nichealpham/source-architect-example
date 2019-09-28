import { IRecord } from './interface/IRecord';
import { IRecordLookup } from './interface/IRecordLookup';
import { FileHelper } from 'sandrasoft';

export class RecordLookupModel {
    static from(data: IRecord): IRecordLookup {
        let duration = data.fileInfo.analysisInterval *
            ((data.analysis && data.analysis.total) || 0);

        return {
            _id: data._id,
            name: data.name,

            keywords: [
                `fs:${data.fileInfo.samplingFrequency}hz`,
                `size:${FileHelper.convert2ReadableFileSize(data.fileInfo.size).toLowerCase()}`,
                `name:${data.name.toLowerCase()}`,
                `duration:${duration}s`,
                `interval:${data.fileInfo.analysisInterval}s`,
                `extension:${data.fileInfo.extension}`,
                ...data.name.split(' ').map(part => `name:${part.toLocaleLowerCase()}`)
            ],

            size: data.fileInfo.size,
            extension: data.fileInfo.extension,
            signalDuration: duration,
            samplingFrequency: data.fileInfo.samplingFrequency,

            categories: (data.analysis && data.analysis.categories) || [],
            createdAt: data.createdAt,
            _userId: data._userId,
        }
    }
}