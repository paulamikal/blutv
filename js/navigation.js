const Navigation = {

    back: function () {

        if (AppState.dialogOpen) {
            Dialog.close();
            return;
        }

        if (AppState.playerVisible) {
            Player.stop();
            return;
        }

        switch (AppState.screen) {
            case "live":
                Router.go("home");
                break;

            case "live-channels":
                LiveChannels.stopPreview();
                Router.go("live");
                break;

            case "movies":
                Router.go("home");
                break;

            case "movies-catalog":
                Router.go("movies");
                break;    

            case "movie-detail":
                Router.go("movies-catalog");
                break;
            
            case "series":
                Router.go("home");
                break;

            case "series-catalog":
                Router.go("series");
                break;

            case "series-detail":
                SeriesDetail.back();
                break;
            
            case "settings":
                Router.go("home");
                break;

            case "home":
                Dialog.show({
                    title: "Salir de BluTV",
                    message: "¿Desea salir de la aplicación?",
                    buttons: [
                        { label : "Cancelar", action: () => {} },
                        { label : "Salir", action: () => {
                            if (typeof tizen !== "undefined" && tizen.application) {
                                tizen.application.getCurrentApplication().exit();
                            } else {
                                console.log("Salir de la app (solo disponible en Tizen)");
                            }
                        }}
                    ]
                });
                break;

            case "login":
                break;

            default:
                console.log("Sin regla de retroceso definida para:", AppState.screen);
        }
    }

};
window.Navigation = Navigation;