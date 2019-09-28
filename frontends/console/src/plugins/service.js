import axios from 'axios';
import UserService from '~/services/userService';
import StreamService from '~/services/streamService';
import RecordService from '~/services/recordService';
import ReportService from '~/services/reportService';
import PaymentService from '~/services/paymentService';
import AnalyticService from '~/services/analyticService';
import UserAuthenticationService from '~/services/userAuthenticationService';
const gateway = require('../../gateway.json');
const ApiGateway = process.env.NODE_ENV === 'Local' ? gateway.local : gateway.dev;

export default ({ app, redirect, route, store, router }, inject) => {
    let userAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.UserService,
        timeout: 300000
    }));
    let streamAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.StreamService,
        timeout: 60000000
    }));
    let recordAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.RecordService,
        timeout: 60000000
    }));
    let reportAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.ReportService,
        timeout: 60000000
    }));
    let paymentAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.PaymentService,
        timeout: 300000
    }));
    let analyticAxios = createAxiosInstance(axios.create({
        baseURL: ApiGateway.AnalyticService,
        timeout: 300000
    }));

    inject('services', {
        userService: new UserService(userAxios),
        streamService: new StreamService(streamAxios),
        recordService: new RecordService(recordAxios),
        reportService: new ReportService(reportAxios),
        paymentService: new PaymentService(paymentAxios),
        analyticService: new AnalyticService(analyticAxios),
        userAuthenticationService: new UserAuthenticationService(store),
    });

    function setToken(option) {
        if (!option)
            option = {};
        if (!option.headers)
            option.headers = {};
        if (store.state.userAuthen) {
            if (store.state.userAuthen._id)
                option.headers["_uuid"] = store.state.userAuthen._id;
            if (store.state.userAuthen.email)
                option.headers["email"] = store.state.userAuthen.email;
            if (store.state.userAuthen.accessToken)
                option.headers["authorization"] = store.state.userAuthen.accessToken;
        }
        return option;
    }

    function handleError(err) {
        return { error: err.toString() };
    }

    function createAxiosInstance(axiosInstance) {
        return {
            get: (url, option) => {
                return new Promise((resolve) => {
                    option = setToken(option);
                    axiosInstance.get(url, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            post: (url, data, option) => {
                return new Promise((resolve) => {
                    option = setToken(option);
                    axiosInstance.post(url, data, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            putFile: (url, file, uploadKey, data = {}, onUploadProgress = null, option = null) => {
                let formData = new FormData();
                formData.append(uploadKey, file);
                for (let key in data) {
                    formData.append(key, data[key]);
                };
                option = setToken(option);
                // option.headers["Content-Type"] = "multipart/form-data";
                if (onUploadProgress)
                    option.onUploadProgress = onUploadProgress;
                return new Promise((resolve) => {
                    axiosInstance.put(url, formData, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            postFile: (url, file, uploadKey, data = {}, onUploadProgress = null, option = null) => {
                let formData = new FormData();
                formData.append(uploadKey, file);
                for (let key in data) {
                    formData.append(key, data[key]);
                };
                option = setToken(option);
                // option.headers["Content-Type"] = "multipart/form-data";
                if (onUploadProgress)
                    option.onUploadProgress = onUploadProgress;
                return new Promise((resolve) => {
                    axiosInstance.post(url, formData, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            put: (url, data, option) => {
                return new Promise((resolve) => {
                    option = setToken(option);
                    axiosInstance.put(url, data, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            patch: (url, data, option) => {
                return new Promise((resolve) => {
                    option = setToken(option);
                    axiosInstance.patch(url, data, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            },
            delete: (url, option) => {
                return new Promise((resolve) => {
                    option = setToken(option);
                    axiosInstance.delete(url, option).then(({ data }) => resolve(data)).catch(err => resolve(handleError(err)));
                });
            }
        };
    }
};
