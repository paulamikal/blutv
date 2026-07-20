const SeriesDetail = {
    currentItem: null,
    seasons: [],
    episodesBySeason: {},
    viewMode: "seasons",
    selectedSeasonIndex: 0,
    selectedEpisodeIndex: 0,
    currentSeasonNumber: null,
    focus: "actions",

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
                <div class="detail-meta" id="detailMeta"></div>
                <p id="detail-plot">${item.plot || "Cargando descripción..."}</p>
                <p class="detail-cast" id="detailCast"></p>
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
        if (btn) {
            btn.onclick = () => this.playDefault();
            btn.classList.add("active");
        }

        this.loadInfo();
    },

    loadInfo: async function () {
        const item = this.currentItem;
        if (!item) return;
        try {
            const data = await API.getSeriesInfo(item.series_id);

            const info = data?.info || {};
            const plot = info.plot || item.plot;
            const plotEl = document.getElementById("detail-plot");
            if (plotEl) plotEl.innerText = plot || "Sin descripción disponible.";

            this.renderMeta(info);
            this.renderCast(info);

            this.seasons = data?.seasons || [];
            this.episodesBySeason = data?.episodes || {};

            this.renderList();
        } catch (e) {
            console.log("SERIES INFO ERROR", e);
            const plotEl = document.getElementById("detail-plot");
            if (plotEl) plotEl.innerText = "Sin descripción disponible.";
        }
    },

    renderMeta: function (info) {
        const el = document.getElementById("detailMeta");
        if (!el) return;
        const parts = [];

        const mins = parseInt(info.episode_run_time, 10);
        if (mins > 0) parts.push(`<span class="detail-meta-item">${mins} min / episodio</span>`);

        const stars = parseFloat(info.rating_5based);
        if (stars > 0) {
            parts.push(`<span class="detail-meta-item detail-stars">${this.starsHTML(stars)}</span>`);
        }

        if (info.genre) parts.push(`<span class="detail-meta-item">${info.genre}</span>`);

        el.innerHTML = parts.join('<span class="detail-meta-dot">•</span>');
    },

    renderCast: function (info) {
        const el = document.getElementById("detailCast");
        if (!el) return;
        if (info.cast) {
            el.innerHTML = `<strong>Reparto:</strong> ${info.cast}`;
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    },

    starsHTML: function (rating0to5) {
        const n = Math.max(0, Math.min(5, Math.round(rating0to5)));
        return "★".repeat(n) + "☆".repeat(5 - n);
    },

    renderList: function () {
        const btn = document.getElementById("btnPlay");
        if (btn) btn.classList.toggle("active", this.focus === "actions");

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
        Player.play(url, this.currentItem?.name || "Serie", "vod", "series-detail");
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