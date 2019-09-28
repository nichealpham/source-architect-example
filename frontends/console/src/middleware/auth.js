export default function ({ store, route, redirect }) {
    let pathUrl = route.path.toLowerCase();

    if (!store.state.userAuthen && !['/login', '/forgot-password', '/register', '/reset'].find(path => pathUrl.startsWith(path)))
        return redirect('/login');
    else if (['/login', '/forgot-password', '/register', '/reset'].find(path => pathUrl.startsWith(path)))
        return redirect('/');
};
