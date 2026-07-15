const AppState = {
    screen: "login",
    playerVisible: false,
    dialogOpen: false,
    history: []
};

window.AppState = AppState;

AppState.back = function () {
    if (!this.history.length)
        return null;
    return this.history.pop();
};

AppState.go = function (screen) {
    location.hash = screen;
};