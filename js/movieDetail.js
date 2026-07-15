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
                <p id="detail-plot">Cargando descripción...</p>
                <button id="btnPlay">▶ Reproducir</button>
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
            const plot = data?.info?.plot;
            const el = document.getElementById("detail-plot");
            if (el) el.innerText = plot || "Sin descripción disponible.";
        } catch (e) {
            console.log("VOD INFO ERROR", e);
            const el = document.getElementById("detail-plot");
            if (el) el.innerText = "Sin descripción disponible.";
        }
    },

    play: function () {
        const item = this.currentItem;
        const creds = Session.credentials;
        if (!item || !creds) return;
        const ext = item.container_extension || "mp4";
        const url = `${creds.server}/movie/${creds.username}/${creds.password}/${item.stream_id}.${ext}`;
        Player.init();
        Player.play(url, item.name, "vod");
    },

    bindKeys: function () {
        document.onkeydown = (e) => {
            if (e.key === "Enter") {
                this.play();
            }
        };
    },

    handleKey: function (key) {
        if (key === "Enter") {
            this.play();
        }
    }
};
window.MovieDetail = MovieDetail;