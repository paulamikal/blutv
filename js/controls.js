const Controls = {

    mode: "menu",

    init: function () {
        document.addEventListener("keydown", (e) => this.handle(e));
    },

    setMode: function (m) {
        this.mode = m;
    },

    handle: function (e) {

        const key = e.key;
        if (key === "Escape" || key === "Backspace" || key === "Back" || e.keyCode === 10009) {
            Navigation.back();
            return;
        }

        if (AppState.dialogOpen) {
            return;
        }

        if (this.mode === "player") {
            if (Player.currentType === "vod") {
                VodControls.handleKey(key);
                return;
            }
            switch (key) {

                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    Overlay.show();
                    break;

                case "Enter":
                    Overlay.show();
                    break;
            }

            return;
        }

        FocusManager.handleKey(key);
    }
};
window.Controls = Controls;