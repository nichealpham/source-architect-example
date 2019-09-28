export default class ReportService {
    constructor(axios) {
        this.axios = axios;
    }

    getReportById(_id) {
        return this.axios.get(`/get/${_id}`);
    }

    findReportByRecordId(_recordId) {
        return this.axios.get(`/find/${_recordId}`);
    }

    createReportForRecord(_recordId) {
        return this.axios.post(`/create/${_recordId}`);
    }

    updateReportByRecordId(_recordId, data) {
        return this.axios.put(`/update/${_recordId}`, data);
    }
};
