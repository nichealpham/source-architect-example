export default class UserService {
    constructor(axios) {
        this.axios = axios;
    }

    login(email, password) {
        return this.axios.post(`/login`, { email, password });
    }

    logout() {
        return this.axios.post(`/logout`);
    }

    getUserInfo(_id) {
        return this.axios.get(`/${_id}`);
    }

    update(_id, user) {
        return this.axios.put(`/update/${_id}`, user);
    }

    updateAvatar(_id, file) {
        return this.axios.putFile(`/avatar/${_id}`, file, 'fileUpload');
    }
};
