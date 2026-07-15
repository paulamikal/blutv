const Overlay = {
    visible: false,
    timer: null,
    init: function () {
        this.create();
        this.bindKeys();
    },

    create: function () {
        const el = document.createElement("div");
        el.id = "tv-overlay";

        el.innerHTML = `
            <div class="overlay-top">
                <div id="ov-channel">Canal</div>
                <div id="ov-time"></div>
            </div>
        `;

        document.body.appendChild(el);
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    },

    show: function (channelName = "LIVE") {
        document.getElementById("ov-channel").innerText = channelName;
        const el = document.getElementById("tv-overlay");
        el.style.opacity = "1";
        el.style.transform = "translateY(0px)";
        this.visible = true;
        this.resetTimer();
    },

    hide: function () {
        const el = document.getElementById("tv-overlay");
        if (!el) return;
        el.style.opacity = "0";
        el.style.transform = "translateY(-20px)";
        this.visible = false;
    },

    resetTimer: function () {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.hide();
        }, 4000);
    },

    updateTime: function () {
        const now = new Date();
        document.getElementById("ov-time").innerText =
            now.toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit"
            });
    },

    bindKeys: function () {
        document.addEventListener("keydown", (e) => {
            if (Controls.mode !== "player") return;
            if (e.key === "Escape" || e.key === "Backspace") return;
            this.show();
        });


    }
};