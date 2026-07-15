window.onload = async () => {
    Router.register("splash", Splash);
    Router.register("login", Login);
    Router.register("home", Home);
    Router.register("live", Live);
    Router.register("live-channels", LiveChannels);
    Router.register("movies", Movies);
    Router.register("movie-detail", MovieDetail);
    Router.register("movies-catalog", MoviesCatalog);
    Router.register("series", Series);
    Router.register("series-detail", SeriesDetail);
    Router.register("series-catalog", SeriesCatalog);
    Router.register("settings", Settings);
    location.hash = "splash";
    Router.init();
    Controls.init();
    Overlay.init();
    Dialog.init();

    const minSplashTime = new Promise(resolve => setTimeout(resolve, 1000));
    const hasSession = Session.restore();
    let target = "login";
    if (hasSession) {
        const creds = Session.credentials;
        try {
            const ok = await Session.login(creds.server, creds.username, creds.password);
            if (ok) {
                target = "home";
            } else {
                Session.logout();
            }
        } catch (e) {
            console.log("AUTOLOGIN ERROR", e);
            Session.logout();
        }
    }
    await minSplashTime;
    Router.go(target);
};