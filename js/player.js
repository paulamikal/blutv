const Player = {
    isTizen: typeof webapis !== "undefined" && webapis.avplay,
    currentUrl: null,

    init: function () {
        if (!this.isTizen) {
            console.log("Fallback HTML5 mode");
            return;
        }
        try {
            webapis.avplay.close();
        } catch (e) { }
    },

    play: function (url, channelName = "LIVE", type = "live") {
        console.log("PLAY URL:", url);
        this.currentUrl = url;
        this.currentType = type;
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

            webapis.avplay.open(url);
            webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
            webapis.avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_AUTO_ASPECT_RATIO");
            webapis.avplay.setListener({
                onbufferingstart: function () { console.log("Buffering..."); },
                onbufferingcomplete: function () { console.log("Buffer OK"); },
                onstreamcompleted: function () { console.log("Stream finished"); },
                onerror: function (e) { console.log("AVPlay error:", e); }
            });

            webapis.avplay.prepareAsync(() => {
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
                console.error("prepareAsync error:", err);
            });

        } catch (e) {
            console.error("AVPlay crash:", e);
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

        video.src = url;
        video.style.display = "block";
        video.play();
        AppState.playerVisible = true;
        Controls.setMode("player");
        if (type === "vod") {
            VodControls.init(channelName);
        } else {
            Overlay.show(channelName);
        }
    },

    stop: function () {
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