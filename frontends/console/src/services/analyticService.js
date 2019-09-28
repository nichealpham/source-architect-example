export default class AnalyticService {
    constructor(axios) {
        this.axios = axios;
    }

    getUsages(dates) {
        return this.axios.get(`/get/usage?dates=${dates.join(',')}`);
    }
};
