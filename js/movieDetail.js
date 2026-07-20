const MovieDetail = {
    currentItem: null,

    render: function () {
        const item = this.currentItem;
        if (!item) {
            return `<div class="detail">No hay datos de la película</div>`;
        }
        return `
        <div class="detail">
            <img class="detail-poster" src="${item.stream_icon || ""}" />
            <div class="detail-info">
                <h2>${item.name}</h2>
                <div class="detail-meta" id="detailMeta"></div>
                <p id="detail-plot">Cargando descripción...</p>
                <p class="detail-cast" id="detailCast"></p>
                <button id="btnPlay" class="active">▶ Reproducir</button>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        const btn = document.getElementById("btnPlay");
        if (btn) btn.onclick = () => this.play();
        this.loadInfo();
    },

    loadInfo: async function () {
        const item = this.currentItem;
        if (!item) return;
        try {
            const data = await API.getVodInfo(item.stream_id);
            const info = data?.info || {};

            const plotEl = document.getElementById("detail-plot");
            if (plotEl) plotEl.innerText = info.plot || "Sin descripción disponible.";

            this.renderMeta(info);
            this.renderCast(info);
        } catch (e) {
            console.log("VOD INFO ERROR", e);
            const el = document.getElementById("detail-plot");
            if (el) el.innerText = "Sin descripción disponible.";
        }
    },

    renderMeta: function (info) {
        const el = document.getElementById("detailMeta");
        if (!el) return;
        const parts = [];

        const duration = this.formatDuration(info.duration);
        if (duration) parts.push(`<span class="detail-meta-item">${duration}</span>`);

        const rating = parseFloat(info.rating);
        if (rating > 0) {
            parts.push(`<span class="detail-meta-item detail-stars">${this.starsHTML(rating)}</span>`);
        }

        if (info.genre) parts.push(`<span class="detail-meta-item">${info.genre}</span>`);

        el.innerHTML = parts.join('<span class="detail-meta-dot">•</span>');
    },

    renderCast: function (info) {
        const el = document.getElementById("detailCast");
        if (!el) return;
        if (info.actors || info.cast) {
            el.innerHTML = `<strong>Reparto:</strong> ${info.actors || info.cast}`;
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    },

    formatDuration: function (hhmmss) {
        if (!hhmmss) return null;
        const parts = hhmmss.split(":").map(Number);
        const h = parts[0] || 0;
        const m = parts[1] || 0;
        if (!h && !m) return null;
        return (h ? `${h}h ` : "") + (m ? `${m}m` : "");
    },

    starsHTML: function (rating0to10) {
        const n = Math.max(0, Math.min(5, Math.round(rating0to10 / 2)));
        return "★".repeat(n) + "☆".repeat(5 - n);
    },

    play: function () {
        const item = this.currentItem;
        const creds = Session.credentials;
        if (!item || !creds) return;
        const ext = item.container_extension || "mp4";
        const url = `${creds.server}/movie/${creds.username}/${creds.password}/${item.stream_id}.${ext}`;
        Player.init();
        Player.play(url, item.name, "vod", "movie-detail");
    },

    handleKey: function (key) {
        if (key === "Enter") {
            this.play();
        }
    }
};
window.MovieDetail = MovieDetail;