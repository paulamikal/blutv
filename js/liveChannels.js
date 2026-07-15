const LiveChannels = {
    categoryId: null,
    categoryName: "",
    channelsData: [],
    selectedChannel: 0,
    debounceTimer: null,
    isTizen: typeof webapis !== "undefined" && webapis.avplay,

    init: async function () {
        try {
            const chans = await API.getLiveStreams(this.categoryId);
            this.channelsData = chans || [];
            this.selectedChannel = 0;
            this.buildList();
            this.schedulePreview();
        } catch (e) {
            console.log("INIT LIVE CHANNELS ERROR", e);
        }
    },

    render: function () {
        return `
        <div class="live">
            <div class="live-header">
                <h2>${this.categoryName}</h2>
            </div>
            <div class="live-channels-container">
                <div class="channel-list-plain" id="chanOnlyList"></div>
                <div class="preview-box" id="previewBox">
                    <video id="preview-video" class="preview-video"></video>
                    <div class="preview-label" id="previewLabel">Cargando...</div>
                </div>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        this.buildList();
    },

    buildList: function () {
        const el = document.getElementById("chanOnlyList");
        el.innerHTML = "";
        this.channelsData.forEach((ch, i) => {
            const div = document.createElement("div");
            div.className = "item " + (i === this.selectedChannel ? "active" : "");
            div.innerText = ch.name;
            div.onclick = () => {
                this.selectedChannel = i;
                this.updateFocus();
                this.schedulePreview();
            };
            el.appendChild(div);
        });
        this.scrollToActive();
    },

    updateFocus: function () {
        const el = document.getElementById("chanOnlyList");
        [...el.children].forEach((item, i) => {
            item.classList.toggle("active", i === this.selectedChannel);
        });
        this.scrollToActive();
    },

    scrollToActive: function () {
        const el = document.getElementById("chanOnlyList");
        const active = el.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    schedulePreview: function () {
        clearTimeout(this.debounceTimer);
        const label = document.getElementById("previewLabel");
        if (label) label.innerText = "Cargando...";
        this.debounceTimer = setTimeout(() => {
            this.loadPreview();
        }, 1500);
    },

    loadPreview: function () {
        const ch = this.channelsData[this.selectedChannel];
        if (!ch) return;
        const creds = Session.credentials;
        if (!creds) return;
        const url = `${creds.server}/live/${creds.username}/${creds.password}/${ch.stream_id}.ts`;
        const label = document.getElementById("previewLabel");
        if (label) label.innerText = ch.name;

        if (this.isTizen) {
            try { webapis.avplay.stop(); webapis.avplay.close(); } catch (e) {}
            try {
                webapis.avplay.open(url);
                webapis.avplay.setDisplayRect(1380, 640, 480, 270);
                webapis.avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_LETTER_BOX");
                webapis.avplay.prepareAsync(() => {
                    webapis.avplay.play();
                }, (err) => console.log("Preview AVPlay error", err));
            } catch (e) {
                console.log("Preview AVPlay crash", e);
            }
        } else {
            const video = document.getElementById("preview-video");
            if (video) {
                video.src = url;
                video.play().catch(() => {});
            }
        }
    },

    stopPreview: function () {
        clearTimeout(this.debounceTimer);
        if (this.isTizen) {
            try { webapis.avplay.stop(); webapis.avplay.close(); } catch (e) {}
        } else {
            const video = document.getElementById("preview-video");
            if (video) { video.pause(); video.removeAttribute("src"); }
        }
    },

    playFullscreen: function () {
        const ch = this.channelsData[this.selectedChannel];
        if (!ch) return;
        const creds = Session.credentials;
        if (!creds) return;
        this.stopPreview();
        const url = `${creds.server}/live/${creds.username}/${creds.password}/${ch.stream_id}.ts`;
        Player.init();
        Player.play(url, ch.name, "live");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedChannel = Math.min(this.selectedChannel + 1, this.channelsData.length - 1);
                this.updateFocus();
                this.schedulePreview();
                break;
            case "ArrowUp":
                this.selectedChannel = Math.max(this.selectedChannel - 1, 0);
                this.updateFocus();
                this.schedulePreview();
                break;
            case "Enter":
                this.playFullscreen();
                break;
        }
    }
};
window.LiveChannels = LiveChannels;