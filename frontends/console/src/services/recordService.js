export default class RecordService {
    constructor(axios) {
        this.axios = axios;
    }

    getById(_id) {
        return this.axios.get(`/get/${_id}`);
    }

    getLookups(filter = {}, page = 1, limit = 20) {
        return this.axios.get(`/lookups?filter=${JSON.stringify(filter)}&page=${page}&limit=${limit}`);
    }

    getCount(filter = {}) {
        return this.axios.get(`/lookups/count?filter=${JSON.stringify(filter)}`);
    }

    getLookupsV1(dates = []) {
        if (!dates.length) {
            return [];
        }
        return this.axios.get(`/lookups/v1?dates=${dates.join(',')}`);
    }

    getAnalyzing() {
        return this.axios.get(`/analyzing`);
    }

    getStatus(_id) {
        return this.axios.get(`/status/${_id}`);
    }

    create(file, data) {
        return this.axios.postFile(`/create`, file, 'fileUpload', data);
    }

    delete(_id) {
        if (!_id)
            return { body: false };
        return this.axios.delete(`/delete/${_id}`);
    }
};
