import { IUser } from "../user/interface/IUser";
import { IRecord } from "../record/interface/IRecord";
import { IRecordCategory } from "../record/interface/IRecordCategory";

import * as moment from 'moment';

export class CleanTemplate {
    static schema = {
        title: "Electrocardiogram Analysis Report",
        date: new Date(),
        requester: "",
        header: {
            "Logo Url": "https://nichealpham.github.io/Cassandra-project/images/logo.png",
            "Company Name": "Cassandra AI, Co. LTD",
            "Address": "International University, Vietnam National University, HCMC",
            "Telephone": "+(84)-914-118-896",
            "Fax": "IKD81-9876-B832A"
        },
        pages: [
            {
                "1) Patient Information": {
                    "Full Name": "",
                    "Email": "",
                    "Telephone": "",
                    "Address": "",
                    "Birthdate": "",
                    "Measurement": "",
                    "Medical History": ""
                },
                "2) Doctor / Physician Information": {
                    "Full Name": "Alexa AI - CASSANDRA AI, CO. LTD",
                    "Email": "alexa.ai@cassandra.ai",
                    "Telephone": "",
                    "Hospital": "",
                    "Department": "Cardiology",
                    "Certificate ID": "",
                    "Work Address": "International University, Vietnam National University, HCMC"
                },
                "3) Diagnosis Information": {
                    "Analysis Result": "",
                    "Test Condition": "Measurement During Office Hours",
                    "Measured Date": "",
                    "Symptoms": "",
                    "Medication": "",
                    "Interpretation": "",
                    "Signal Indicator": ""
                },
            },
            {
                "4) Signal Information": {
                    "Record ID": "",
                    "Record Name": "",
                    "Created": "",
                    "Sampling Rate": "",
                    "Duration": "",
                    "File Info": ""
                },
                "5) Device Information": {
                    "Name": "",
                    "Device ID": "",
                    "Specification": "",
                    "Accessories": ""
                },
                "6) Additional Information": {
                    "Patient's Notes": "",
                    "Physician's Notes": ""
                }
            }
        ]
    }

    static generateFrom(user: IUser, record: IRecord) {
        let schema = JSON.parse(JSON.stringify(this.schema));
        schema.requester = `${user.firstName}, ${user.lastName}`;
        schema.pages[0]['1) Patient Information'] = {
            "Full Name": `${user.firstName}, ${user.lastName}`,
            "Email": user.email,
            "Telephone": (user.personalInfo && user.personalInfo.phone) || "",
            "Address": (user.personalInfo && user.personalInfo.address) || "",
            "Birthdate": "",
            "Measurement": "",
            "Medical History": ""
        };
        schema.pages[0]['3) Diagnosis Information'] = {
            "Analysis Result": getCategoriesStatistics((record.analysis && record.analysis.categories) || []),
            "Test Condition": "Measurement During Office Hours",
            "Measured Date": moment(record.createdAt).format('MMMM Do, YYYY'),
            "Symptoms": "",
            "Medication": "",
            "Interpretation": "",
            "Signal Indicator": provideSignalIndicators((record.analysis && record.analysis.categories) || [])
        };
        schema.pages[1]['4) Signal Information'] = {
            "Record ID": record._id,
            "Record Name": record.name,
            "Created": moment(record.createdAt).format('MMMM Do, YYYY'),
            "Sampling Rate": `${record.fileInfo.samplingFrequency}Hz`,
            "Duration": provideAnalysisDuration(record),
            "File Info": `${record.fileInfo.mimetype}, ${record.fileInfo.encoding} encoding, ${convert2HumanFileSize(record.fileInfo.size)}`
        };
        return schema;
    }
}

function provideAnalysisDuration(record: IRecord): string {
    let interval = record.fileInfo.analysisInterval || 0;
    let counts = (record.analysis && record.analysis.total) || 0;
    let total = Number(interval) * Number(counts);
    return `${convert2HumanTimeStamp(interval)} interval x ${counts} segments = ${convert2HumanTimeStamp(total)} total`;
}

function getCategoriesStatistics(categories: IRecordCategory[]): string {
    let percentages = [
        { name: 'AMI', value: 0 },
        { name: 'ISC', value: 0 },
        { name: 'NSR', value: 0 },
        { name: 'SCD', value: 0 },
    ];
    categories.forEach(category => {
        percentages[Number(category.value)].value = category.confidenceLevel;
    });
    return percentages.map(percentage => `${percentage.name} ${percentage.value * 100}%`).join(', ');
}

function provideSignalIndicators(categories: IRecordCategory[]): string {
    let indicators: string[] = [];
    categories.forEach(category => {
        switch(Number(category.value)) {
            case 0:
                indicators.push('ST Elevation/Depression presented');
                break;
            case 1:
                if (indicators.length)
                    indicators.push('also found ST Deviation');
                else
                    indicators.push('ST Deviation presented')
                break;
            case 2:
                break;
            case 3:
                if (indicators.length)
                    indicators.push('and detected other abnormal waveforms');
                else
                    indicators.push('Other abnormal morphology is detected');
                break;
        }
    });
    if (!indicators.length)
        indicators.push('Normal ECG');
    return indicators.join(', ');
}

function convert2HumanFileSize(size: number, decimal = 0): string {
    let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    let value = (size / Math.pow(1024, i)).toFixed(decimal);
    return value + ["B", "kB", "MB", "GB", "TB"][i];
};
function convert2HumanTimeStamp(seconds: number): string {
    if (!seconds)
      seconds = 0;
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);

    let result = "";
    if (h > 0) result += h + "h";
    if (m > 0) result += m + "m";
    if (s > 0 && h <= 0 && m <= 0) result += s + "s";
    return result;
};