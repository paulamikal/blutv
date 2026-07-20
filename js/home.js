const Home = {
    selectedIndex: 0,
    options: [
        { id: "live", icon: "📡", label: "TV en vivo", tile: "tile-live", live: true, action: () => Router.go('live') },
        { id: "series", icon: "🎬", label: "Series", tile: "tile-series", action: () => Router.go('series') },
        { id: "movies", icon: "🎞️", label: "Películas", tile: "tile-movies", action: () => Router.go('movies') },
        { id: "settings", icon: "⚙️", label: "Ajustes", tile: "tile-settings", action: () => Router.go('settings') }
    ],
    clockInterval: null,

    render: function () {
        return `
        <div class="home-screen">
            <div class="home-ambient">
                <div class="home-blob blob-a"></div>
                <div class="home-blob blob-b"></div>
            </div>
            <div class="home-vignette"></div>
            <div class="home-clock" id="homeClock">--:--</div>

            <div class="brand">
                <div class="mark">B</div>
                <div class="word">Blu<span>TV</span></div>
            </div>

            <nav class="home-menu" id="homeMenu"></nav>

            <div class="home-hint-bar">
                <span>
                    <span class="home-key">◀</span><span class="home-key">▶</span><span class="home-key">▲</span><span class="home-key">▼</span> mover
                </span>
                <span><span class="home-key home-key-ok">OK</span> seleccionar</span>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        this.selectedIndex = 0;
        this.buildMenu();
        this.startClock();
    },

    buildMenu: function () {
        const el = document.getElementById("homeMenu");
        el.innerHTML = "";
        this.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = `home-tile ${opt.tile} ` + (i === this.selectedIndex ? "active" : "");
            div.innerHTML = `
                ${opt.live ? '<span class="home-live-dot"></span>' : ""}
                <span class="tile-icon">${opt.icon}</span>
                <span class="tile-label">${opt.label}</span>
            `;
            div.onclick = () => opt.action();
            el.appendChild(div);
        });
    },

    updateFocus: function () {
        const el = document.getElementById("homeMenu");
        [...el.children].forEach((tile, i) => {
            tile.classList.toggle("active", i === this.selectedIndex);
        });
    },

    startClock: function () {
        if (this.clockInterval) clearInterval(this.clockInterval);
        const update = () => {
            const now = new Date();
            const el = document.getElementById("homeClock");
            if (el) el.innerText = now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
        };
        update();
        this.clockInterval = setInterval(update, 30000);
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowLeft":
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateFocus();
                break;
            case "ArrowRight":
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.options.length - 1);
                this.updateFocus();
                break;
            case "Enter":
                this.options[this.selectedIndex].action();
                break;
        }
    }
};
window.Home = Home;