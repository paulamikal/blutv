const Router = {
    routes: {},
    currentRoute: null,

    init() {
        window.addEventListener(
            "hashchange",
            this.handleRoute.bind(this)
        );
        this.handleRoute();
    },

    register(path, component) {
        this.routes[path] = component;
    },

    go(path) {
        location.hash = path;
    },

    reload() {
        this.handleRoute();
    },

    handleRoute() {
        const path =
            location.hash.replace("#", "") || "login";

        if (this.currentRoute && this.currentRoute !== path) {
            AppState.history.push(this.currentRoute);
        }
        AppState.screen = path;

        this.currentRoute = path;

        const view = this.routes[path];
        const app = document.getElementById("app");
        if (!view) {
            app.innerHTML = "Ruta no encontrada";
            return;
        }

        app.innerHTML = view.render();

        if (view.afterRender)
            view.afterRender();
        if (view.init)
            view.init();
    }
};
window.Router = Router;