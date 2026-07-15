const FocusManager = {
    handleKey: function (key) {
        const view = Router.routes[AppState.screen];
        if (view && typeof view.handleKey === "function") {
            view.handleKey(key);
        }
    }
};
window.FocusManager = FocusManager;