const VodControls = {
    visible: false,
    focusIndex: 2,
    isPlaying: true,
    hideTimer: null,
    progressTimer: null,
    title: "",
    isTizen: typeof webapis !== "undefined" && webapis.avplay,
    buttons: ["restart", "rewind", "playpause", "forward", "skipend"],

    init: function (title) {
        this.title = title;
        this.focusIndex = 2;
        this.isPlaying = true;
        this.render();
        clearInterval(this.progressTimer);
        this.progressTimer = setInterval(() => this.updateProgress(), 1000);
        this.show();
    },

    render: function () {
        let el = document.getElementById("vod-controls");
        if (!el) {
            el = document.createElement("div");
            el.id = "vod-controls";
            document.body.appendChild(el);
        }
        el.innerHTML = `
            <div class="vod-title">${this.title}</div>
            <div class="vod-progress-track"><div class="vod-progress-fill" id="vodProgressFill"></div></div>
            <div class="vod-time-row">
                <span id="vodCurrentTime">00:00</span>
                <span id="vodDuration">00:00</span>
            </div>
            <div class="vod-buttons" id="vodButtons">
                <div class="vod-btn" data-i="0">⏮</div>
                <div class="vod-btn" data-i="1">⏪ 10</div>
                <div class="vod-btn" data-i="2" id="vodPlayPauseBtn">⏸</div>
                <div class="vod-btn" data-i="3">10 ⏩</div>
                <div class="vod-btn" data-i="4">⏭</div>
            </div>
        `;
        [...el.querySelectorAll(".vod-btn")].forEach((btn) => {
            btn.onclick = () => {
                this.focusIndex = parseInt(btn.dataset.i, 10);
                this.activate();
            };
        });
        this.updateFocusVisual();
    },

    show: function () {
        this.visible = true;
        const el = document.getElementById("vod-controls");
        if (el) el.classList.add("visible");
        this.resetHideTimer();
    },

    hide: function () {
        this.visible = false;
        const el = document.getElementById("vod-controls");
        if (el) el.classList.remove("visible");
    },

    resetHideTimer: function () {
        clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(() => this.hide(), 4000);
    },

    handleKey: function (key) {
        if (!this.visible) {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(key)) {
                this.show();
            }
            return;
        }
        switch (key) {
            case "ArrowLeft":
                this.focusIndex = Math.max(this.focusIndex - 1, 0);
                this.updateFocusVisual();
                this.resetHideTimer();
                break;
            case "ArrowRight":
                this.focusIndex = Math.min(this.focusIndex + 1, this.buttons.length - 1);
                this.updateFocusVisual();
                this.resetHideTimer();
                break;
            case "Enter":
                this.activate();
                this.resetHideTimer();
                break;
            default:
                this.resetHideTimer();
        }
    },

    updateFocusVisual: function () {
        const el = document.getElementById("vodButtons");
        if (!el) return;
        [...el.children].forEach((btn, i) => btn.classList.toggle("active", i === this.focusIndex));
    },

    getCurrentMs: function () {
        if (this.isTizen) {
            try { return webapis.avplay.getCurrentTime(); } catch (e) { return 0; }
        }
        const v = document.getElementById("blutv-video");
        return v ? v.currentTime * 1000 : 0;
    },

    getDurationMs: function () {
        if (this.isTizen) {
            try { return webapis.avplay.getDuration(); } catch (e) { return 0; }
        }
        const v = document.getElementById("blutv-video");
        return v && v.duration ? v.duration * 1000 : 0;
    },

    seekTo: function (ms) {
        ms = Math.max(0, ms);
        if (this.isTizen) {
            try { webapis.avplay.seekTo(Math.floor(ms)); } catch (e) {}
        } else {
            const v = document.getElementById("blutv-video");
            if (v) v.currentTime = ms / 1000;
        }
    },

    jump: function (deltaMs) {
        if (this.isTizen) {
            try {
                if (deltaMs > 0) webapis.avplay.jumpForward(deltaMs);
                else webapis.avplay.jumpBackward(Math.abs(deltaMs));
            } catch (e) {}
        } else {
            const v = document.getElementById("blutv-video");
            if (v) v.currentTime = Math.max(0, v.currentTime + deltaMs / 1000);
        }
    },

    togglePlayPause: function () {
        if (this.isTizen) {
            try {
                if (this.isPlaying) webapis.avplay.pause();
                else webapis.avplay.play();
            } catch (e) {}
        } else {
            const v = document.getElementById("blutv-video");
            if (v) { this.isPlaying ? v.pause() : v.play(); }
        }
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById("vodPlayPauseBtn");
        if (btn) btn.innerText = this.isPlaying ? "⏸" : "▶";
    },

    activate: function () {
        const action = this.buttons[this.focusIndex];
        if (action === "restart") this.seekTo(0);
        if (action === "rewind") this.jump(-10000);
        if (action === "playpause") this.togglePlayPause();
        if (action === "forward") this.jump(10000);
        if (action === "skipend") {
            const dur = this.getDurationMs();
            if (dur > 0) this.seekTo(Math.max(0, dur - 15000));
        }
    },

    updateProgress: function () {
        const cur = this.getCurrentMs();
        const dur = this.getDurationMs();
        const pct = dur > 0 ? (cur / dur) * 100 : 0;
        const fill = document.getElementById("vodProgressFill");
        if (fill) fill.style.width = pct + "%";
        const curEl = document.getElementById("vodCurrentTime");
        const durEl = document.getElementById("vodDuration");
        if (curEl) curEl.innerText = this.formatTime(cur);
        if (durEl) durEl.innerText = this.formatTime(dur);
    },

    formatTime: function (ms) {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    },

    stop: function () {
        clearInterval(this.progressTimer);
        clearTimeout(this.hideTimer);
        this.visible = false;
        const el = document.getElementById("vod-controls");
        if (el) el.classList.remove("visible");
    }
};
window.VodControls = VodControls;