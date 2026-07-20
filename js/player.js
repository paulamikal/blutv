const Player = {
    isTizen: typeof webapis !== "undefined" && webapis.avplay,
    currentUrl: null,
    prepareTimeout: null,
    returnRoute: null,

    init: function () {
        if (!this.isTizen) {
            console.log("Fallback HTML5 mode");
            return;
        }
        try {
            webapis.avplay.close();
        } catch (e) { }
    },

    play: function (url, channelName = "LIVE", type = "live", returnRoute = "home") {
        console.log("PLAY URL:", url);
        this.currentUrl = url;
        this.currentType = type;
        this.returnRoute = returnRoute;
        this.errorShown = false;
        if (this.isTizen) {
            this.playAVPlay(url, channelName, type);
        } else {
            this.playHTML5(url, channelName, type);
        }
    },

    playAVPlay: function (url, channelName = "LIVE", type = "live") {
        try {
            console.log("AVPlay URL:", url);
            try { webapis.avplay.stop(); } catch (e) { }
            try { webapis.avplay.close(); } catch (e) { }

            this.showPlayerLoading();

            webapis.avplay.open(url);
            webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
            webapis.avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_AUTO_ASPECT_RATIO");
            webapis.avplay.setListener({
                onbufferingstart: () => console.log("Buffering..."),
                onbufferingcomplete: () => console.log("Buffer OK"),
                onstreamcompleted: () => console.log("Stream finished"),
                onerror: (e) => {
                    console.log("AVPlay error:", e);
                    this.handlePlayError();
                }
            });

            this.prepareTimeout = setTimeout(() => {
                this.handlePlayError();
            }, 15000);

            webapis.avplay.prepareAsync(() => {
                clearTimeout(this.prepareTimeout);
                this.hidePlayerLoading();
                document.getElementById("app").style.display = "none";
                webapis.avplay.play();
                AppState.playerVisible = true;
                Controls.setMode("player");
                if (type === "vod") {
                    VodControls.init(channelName);
                } else {
                    Overlay.show(channelName);
                }
            }, (err) => {
                clearTimeout(this.prepareTimeout);
                console.error("prepareAsync error:", err);
                this.handlePlayError();
            });

        } catch (e) {
            console.error("AVPlay crash:", e);
            this.handlePlayError();
        }
    },

    playHTML5: function (url, channelName = "LIVE", type = "live") {
        let video = document.getElementById("blutv-video");
        if (!video) {
            video = document.createElement("video");
            video.id = "blutv-video";
            video.controls = false;
            document.body.appendChild(video);
        }

        this.showPlayerLoading();

        video.onerror = () => this.handlePlayError();
        video.onplaying = () => this.hidePlayerLoading();

        video.src = url;
        video.style.display = "block";
        video.play().catch(() => this.handlePlayError());

        AppState.playerVisible = true;
        Controls.setMode("player");
        if (type === "vod") {
            VodControls.init(channelName);
        } else {
            Overlay.show(channelName);
        }
    },

    showPlayerLoading: function () {
        let el = document.getElementById("playerLoading");
        if (!el) {
            el = document.createElement("div");
            el.id = "playerLoading";
            document.body.appendChild(el);
        }
        el.className = "player-loading visible";
        el.innerHTML = `
            <div class="player-loading-spinner"></div>
            <p class="player-loading-text">Cargando...</p>
        `;
    },

    hidePlayerLoading: function () {
        const el = document.getElementById("playerLoading");
        if (!el) return;
        el.classList.remove("visible");
        setTimeout(() => {
            if (el && !el.classList.contains("visible")) el.remove();
        }, 250);
    },

    handlePlayError: function () {
        if (this.errorShown) return;
        this.errorShown = true;

        clearTimeout(this.prepareTimeout);
        this.hidePlayerLoading();

        if (this.isTizen) {
            try { webapis.avplay.stop(); } catch (e) { }
            try { webapis.avplay.close(); } catch (e) { }
        }

        AppState.playerVisible = false;
        this.currentType = null;
        document.getElementById("app").style.display = "block";
        Controls.setMode("live");
        Overlay.hide();

        Dialog.show({
            title: "Error en la carga",
            message: "No se pudo reproducir este contenido. Es posible que la lista aún no lo tenga disponible.",
            buttons: [
                { label: "Aceptar", action: () => Router.go(this.returnRoute || "home") }
            ]
        });
    },

        forceStopAll: function () {
        clearTimeout(this.prepareTimeout);
        if (this.isTizen) {
            try { webapis.avplay.stop(); } catch (e) { }
            try { webapis.avplay.close(); } catch (e) { }
        }
        const video = document.getElementById("blutv-video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.style.display = "none";
        }
        const preview = document.getElementById("preview-video");
        if (preview) {
            preview.pause();
            preview.removeAttribute("src");
        }
    },

    stop: function () {
        clearTimeout(this.prepareTimeout);
        this.hidePlayerLoading();

        AppState.playerVisible = false;
        if (this.currentType === "vod") {
            VodControls.stop();
        }

        if (this.isTizen) {
            try {
                webapis.avplay.stop();
                webapis.avplay.close();
            } catch (e) { }
        } else {
            const video = document.getElementById("blutv-video");
            if (video) {
                video.onerror = null;
                video.onplaying = null;
                video.pause();
                video.removeAttribute("src");
                video.style.display = "none";
            }
        }

        document.getElementById("app").style.display = "block";
        Controls.setMode("live");
        Overlay.hide();
        this.currentType = null;
    }
};

window.Player = Player;