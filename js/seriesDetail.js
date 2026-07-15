const SeriesDetail = {
    currentItem: null,
    seasons: [],
    episodesBySeason: {},
    viewMode: "seasons",       // "seasons" | "episodes"
    selectedSeasonIndex: 0,
    selectedEpisodeIndex: 0,
    currentSeasonNumber: null,
    focus: "actions",          // "actions" | "list"

    render: function () {
        const item = this.currentItem;
        if (!item) {
            return `<div class="detail">No hay datos de la serie</div>`;
        }
        return `
        <div class="detail">
            <img class="detail-poster" src="${item.cover || ""}" />
            <div class="detail-info">
                <h2>${item.name}</h2>
                <p id="detail-plot">${item.plot || "Cargando descripción..."}</p>
                <button id="btnPlay">▶ Reproducir</button>
                <h3 id="list-title" style="margin-top:24px;">Temporadas</h3>
                <div id="season-episode-list"></div>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        this.viewMode = "seasons";
        this.focus = "actions";
        this.selectedSeasonIndex = 0;
        this.selectedEpisodeIndex = 0;

        const btn = document.getElementById("btnPlay");
        if (btn) btn.onclick = () => this.playDefault();

        this.loadInfo();
    },

    loadInfo: async function () {
        const item = this.currentItem;
        if (!item) return;
        try {
            const data = await API.getSeriesInfo(item.series_id);

            const plot = data?.info?.plot || item.plot;
            const plotEl = document.getElementById("detail-plot");
            if (plotEl) plotEl.innerText = plot || "Sin descripción disponible.";

            this.seasons = data?.seasons || [];
            this.episodesBySeason = data?.episodes || {};

            this.renderList();
        } catch (e) {
            console.log("SERIES INFO ERROR", e);
            const plotEl = document.getElementById("detail-plot");
            if (plotEl) plotEl.innerText = "Sin descripción disponible.";
        }
    },

    renderList: function () {
        const container = document.getElementById("season-episode-list");
        const title = document.getElementById("list-title");
        if (!container) return;
        container.innerHTML = "";

        if (this.viewMode === "seasons") {
            title.innerText = "Temporadas";
            this.seasons.forEach((season, i) => {
                const div = document.createElement("div");
                div.className = "item " + (this.focus === "list" && i === this.selectedSeasonIndex ? "active" : "");
                div.innerText = season.name || `Temporada ${season.season_number}`;
                div.onclick = () => this.openSeason(i);
                container.appendChild(div);
            });
        } else {
            const seasonNum = this.currentSeasonNumber;
            title.innerText = `Episodios - Temporada ${seasonNum}`;
            const episodes = this.episodesBySeason[seasonNum] || [];
            episodes.forEach((ep, i) => {
                const div = document.createElement("div");
                div.className = "item " + (this.focus === "list" && i === this.selectedEpisodeIndex ? "active" : "");
                div.innerText = `${ep.episode_num}. ${ep.title || "Episodio " + ep.episode_num}`;
                div.onclick = () => this.playEpisode(ep);
                container.appendChild(div);
            });
        }
        const active = container.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    openSeason: function (index) {
        const season = this.seasons[index];
        if (!season) return;
        this.currentSeasonNumber = String(season.season_number);
        this.viewMode = "episodes";
        this.selectedEpisodeIndex = 0;
        this.renderList();
    },

    playDefault: function () {
        const firstSeason = this.seasons[0];
        if (!firstSeason) return;
        const seasonNum = String(firstSeason.season_number);
        const episodes = this.episodesBySeason[seasonNum] || [];
        const firstEp = episodes[0];
        if (firstEp) this.playEpisode(firstEp);
    },

    playEpisode: function (ep) {
        const creds = Session.credentials;
        if (!ep || !creds) return;
        const ext = ep.container_extension || "mp4";
        const url = `${creds.server}/series/${creds.username}/${creds.password}/${ep.id}.${ext}`;
        Player.init();
        Player.play(url, this.currentItem?.name || "Serie", "vod");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.moveDown();
                break;
            case "ArrowUp":
                this.moveUp();
                break;
            case "Enter":
                this.select();
                break;
        }
    },
    
    moveDown: function () {
        if (this.focus === "actions") {
            this.focus = "list";
        } else if (this.viewMode === "seasons") {
            this.selectedSeasonIndex = Math.min(this.selectedSeasonIndex + 1, this.seasons.length - 1);
        } else {
            const episodes = this.episodesBySeason[this.currentSeasonNumber] || [];
            this.selectedEpisodeIndex = Math.min(this.selectedEpisodeIndex + 1, episodes.length - 1);
        }
        this.renderList();
    },

    moveUp: function () {
        if (this.focus === "list") {
            if (this.viewMode === "seasons" && this.selectedSeasonIndex === 0) {
                this.focus = "actions";
            } else if (this.viewMode === "episodes" && this.selectedEpisodeIndex === 0) {
                this.focus = "actions";
            } else if (this.viewMode === "seasons") {
                this.selectedSeasonIndex--;
            } else {
                this.selectedEpisodeIndex--;
            }
        }
        this.renderList();
    },

    select: function () {
        if (this.focus === "actions") {
            this.playDefault();
            return;
        }
        if (this.viewMode === "seasons") {
            this.openSeason(this.selectedSeasonIndex);
        } else {
            const episodes = this.episodesBySeason[this.currentSeasonNumber] || [];
            const ep = episodes[this.selectedEpisodeIndex];
            if (ep) this.playEpisode(ep);
        }
    },

    back: function () {
        if (this.viewMode === "episodes") {
            this.viewMode = "seasons";
            this.focus = "list";
            this.selectedSeasonIndex = 0;
            this.renderList();
            return;
        }
        Router.go("series-catalog");
    }
};
window.SeriesDetail = SeriesDetail;