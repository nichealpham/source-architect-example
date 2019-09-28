export default class UserAuthenticationService {
  constructor(store) {
    this.store = store;
  }

  validateLogin() {
    if (!this.store || !this.store.state || !this.store.state.userAuthen || !this.store.state.userAuthen._id || !this.store.state.userAuthen.email || !this.store.state.userAuthen.accessToken)
      return false;
    else
      return true;
  }

  getUserId() {
    return this.store.state.userAuthen && this.store.state.userAuthen._id;
  }

  setUserAuthentication(userAuthen) {
    this.store.commit("SET_USER_AUTHEN", userAuthen);
    return this.store.state.userAuthen;
  }

  expireUserAuthentication() {
    this.store.commit("SET_USER_AUTHEN", null);
    return this.store.state.userAuthen;
  }
};
