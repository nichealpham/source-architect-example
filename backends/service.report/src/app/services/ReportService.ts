import { IAnalysisReport } from '../models/report/interface/IAnalysisReport';
import { IAnalysisReportCreate } from '../models/report/interface/IAnalysisReportCreate';
import { IUserAuthentication } from '../models/user/interface/IUserAuthentication';
import { RecordGateway } from '../gateways/RecordGateway';
import { UserGateway } from '../gateways/UserGateway';
import { SimpleCache } from '../../lib/memcache/SimpleCache';
import { IRecord } from '../models/record/interface/IRecord';
import { IUser } from '../models/user/interface/IUser';
import { ReportRepository } from '../../resource/ReportRepository';
import { MongoUltility } from 'sandrasoft';

import TemplateList from '../models/template/Index';

export class ReportService {
    static memCache = new SimpleCache();

    static async get(_id: string): Promise<IAnalysisReport> {
        let report = this.memCache.get(_id);
        if (!report) {
            report = await ReportRepository.get(_id);
            if (report && report._id)
                this.memCache.cache(report);
        }
        return report;
    }

    static async find(_recordId: string, _userId: string): Promise<IAnalysisReport> {
        let params: any = {
            query: {
                _recordId: MongoUltility.toObjectId(_recordId),
                _userId: MongoUltility.toObjectId(_userId),
            }
        }
        return await ReportRepository.findOne(params);
    }

    static async create(userAuthen: IUserAuthentication, data: IAnalysisReportCreate, template: string = 'Analysis.Clean'): Promise<IAnalysisReport> {
        let headers = {
            "authorization": userAuthen.accessToken,
            "_uuid": userAuthen._id,
            "email": userAuthen.email,
        };
        let user: IUser = await UserGateway.getUserById(data._userId, headers);
        if (!user)
            throw new Error(`User ${data._userId} does not existed!`);

        let record: IRecord = await RecordGateway.getRecordById(data._recordId, headers);
        if (!record)
            throw new Error(`Record ${data._recordId} does not existed!`);
        
        let templateData = TemplateList[template].generateFrom(user, record);
        let report = await ReportRepository.create({
            template,
            _userId: data._userId,
            _recordId: data._recordId,
            data: templateData,
            createdAt: new Date(),
        });
        if (!report)
            throw new Error(`User ${data._userId} cannot create report for record ${data._recordId}! Please try again shortly!`);
        return report;
    }

    static async update(_userId: string, _recordId: string, data: Object): Promise<boolean> {
        let params: any = {
            query: {
                _recordId: MongoUltility.toObjectId(_recordId),
                _userId: MongoUltility.toObjectId(_userId),
            }
        }
        let report = await ReportRepository.findOne(params);
        if (!report) {
            return false;
        }
        let result = await ReportRepository.update(report._id, { data });
        if (result) {
            report = { ...report, ...data };
            this.memCache.cache(report);
        };
        return result;
    }

    static async delete(_id: string): Promise<boolean> {
        let report = await this.get(_id);
        if (!report)
            return true;
        
        this.memCache.expire(_id);
        return await ReportRepository.delete(_id);
    }
}