const SeriesCatalog = {
    categoryId: null,
    categoryName: "",
    seriesData: [],
    selectedSeries: 0,
    columns: 6,

    init: async function () {
        try {
            const series = await API.getSeries(this.categoryId);
            this.seriesData = series || [];
            if (this.selectedSeries >= this.seriesData.length) {
                this.selectedSeries = 0;
            }
            this.buildGrid();
        } catch (e) {
            console.log("INIT SERIES CATALOG ERROR", e);
        }
    },

    render: function () {
        return `
        <div class="movies">
            <div class="movies-header">
                <h2>${this.categoryName}</h2>
            </div>
            <div class="catalog-grid" id="seriesCatalogGrid"></div>
        </div>
        `;
    },

    afterRender: function () {
        this.buildGrid();
    },

    buildGrid: function () {
        const el = document.getElementById("seriesCatalogGrid");
        el.innerHTML = "";
        this.seriesData.forEach((serie, i) => {
            const card = document.createElement("div");
            card.className = "poster-card " + (i === this.selectedSeries ? "active" : "");
            card.innerHTML = `
                <img src="${serie.cover || ""}" onerror="this.classList.add('no-image')" />
                <div class="poster-title">${serie.name}</div>
            `;
            card.onclick = () => this.openDetail(serie);
            el.appendChild(card);
        });
        this.scrollToActive();
    },

    updateFocus: function () {
        const el = document.getElementById("seriesCatalogGrid");
        [...el.children].forEach((card, i) => {
            card.classList.toggle("active", i === this.selectedSeries);
        });
        this.scrollToActive();
    },

    scrollToActive: function () {
        const el = document.getElementById("seriesCatalogGrid");
        const active = el.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    openDetail: function (serie) {
        SeriesDetail.currentItem = serie;
        Router.go("series-detail");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedSeries = Math.min(this.selectedSeries + this.columns, this.seriesData.length - 1);
                this.updateFocus();
                break;
            case "ArrowUp":
                this.selectedSeries = Math.max(this.selectedSeries - this.columns, 0);
                this.updateFocus();
                break;
            case "ArrowRight":
                this.selectedSeries = Math.min(this.selectedSeries + 1, this.seriesData.length - 1);
                this.updateFocus();
                break;
            case "ArrowLeft":
                this.selectedSeries = Math.max(this.selectedSeries - 1, 0);
                this.updateFocus();
                break;
            case "Enter":
                const s = this.seriesData[this.selectedSeries];
                if (s) this.openDetail(s);
                break;
        }
    }
};
window.SeriesCatalog = SeriesCatalog;