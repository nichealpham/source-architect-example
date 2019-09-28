export const state = () => ({
    authenticationKey: 'CassandraConsoleAuthentication',
    userAuthen: null
});

export const mutations = {
    SET_USER_AUTHEN: function (state, userAuthen) {
        state.userAuthen = userAuthen;
        if (process.browser)
            setCookie(state.authenticationKey, state.userAuthen, 15);
    }
};

export const actions = {
    nuxtServerInit({ state }, { req }) {
        if (req.headers.cookie) {
            let userAuthen = getCookie(state.authenticationKey, req.headers.cookie);
            if (userAuthen) {
                userAuthen = JSON.parse(userAuthen);
                state.userAuthen = userAuthen;
            }
        }
    }
};

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + JSON.stringify(cvalue) + ';' + expires + ';path=/';
}

function getCookie(cookieName, stringCookie) {
    let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie);
    if (!strCookie)
        return null;
    return unescape(strCookie[0] ? strCookie[0].toString().replace(/^[^=]+./, '') : '');
}
