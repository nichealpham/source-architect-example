import { SimpleCache } from "../../lib/memcache/SimpleCache";
import { IRecordWaveforms } from "../models/record/interface/IRecordWaveforms";
import { RecordGateway } from "../gateway/RecordGateway";
import { IUserAuthentication } from "../models/user/interface/IUserAuthentication";
import { FileHelper } from "sandrasoft";

export class WaveformService {
    static waveformCaching = new SimpleCache();

    static async getWaveforms(_recordId: string, start: number = 0, limit: number = 1000, userAuthen: IUserAuthentication): Promise<number[][]> {
        let data: IRecordWaveforms = this.waveformCaching.get(_recordId);
        if (!data) {
            let headers = {
                "_uuid": userAuthen._id,
                "email": userAuthen.email,
                "authorization": userAuthen.accessToken,
            };
            let record = await RecordGateway.getById(_recordId, headers);
            if (!record)
                throw new Error(`Cannot get record ${_recordId}! Record not exist or unauthorized to view.`);
            if (!record.dataUrl)
                throw new Error(`Signal is not available at the moment. Please try again shortly!`);

            let csvData = await FileHelper.readFileCsvFromUrl(record.dataUrl);
            if (!csvData || !csvData.length || !csvData[0] || !csvData[0].length)
                throw new Error(`Signal contains no data!`);

            let waveforms: number[][] = [];
            csvData.forEach(rowData => {
                record.fileInfo.dataColumns.forEach((col, _ind) => {
                    if (!waveforms[_ind])
                        waveforms[_ind] = [];
                    let value = Number(rowData[col]);
                    if (value)
                        waveforms[_ind].push(value);
                });
            });
            data = {
                waveforms,
                _id: _recordId,
                _userId: userAuthen._id,
                dataColumns: record.fileInfo.dataColumns,
            };
            let expireAfter = 2 * 24 * 60 * 60 * 1000;
            this.waveformCaching.cache(data, expireAfter);
        }
        return data.waveforms.map(waveform => waveform.slice(start, start + limit));
    }

    static delete(_recordId: string, _userId: string): boolean {
        const waveformCaching = this.waveformCaching.get(_recordId);
        if (!waveformCaching) {
            throw new Error(`Waveform not exists!`);
        }
        if (waveformCaching._userId !== _userId) {
            throw new Error(`Unauthorized to delete this data!`);
        }
        this.waveformCaching.expire(_recordId);
        return true;
    }
}