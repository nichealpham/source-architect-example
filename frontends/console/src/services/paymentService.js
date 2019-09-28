export default class PaymentService {
    constructor(axios) {
        this.axios = axios;
    }

    getServicePricing() {
        return this.axios.get(`/pricing`);
    }

    getPaychecks() {
        return this.axios.get(`/paycheck`);
    }

    getPayableTransactions() {
        return this.axios.get(`/transaction`);
    }

    createPaycheck() {
        return this.axios.post(`/paycheck`);
    }
};
