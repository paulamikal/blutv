const MoviesCatalog = {
    categoryId: null,
    categoryName: "",
    moviesData: [],
    selectedMovie: 0,
    columns: 6,

    init: async function () {
        try {
            const movies = await API.getVodStreams(this.categoryId);
            this.moviesData = movies || [];
            if (this.selectedMovie >= this.moviesData.length) {
                this.selectedMovie = 0;
            }
            this.buildGrid();
        } catch (e) {
            console.log("INIT MOVIES CATALOG ERROR", e);
        }
    },

    render: function () {
        return `
        <div class="movies">
            <div class="movies-header">
                <h2>${this.categoryName}</h2>
            </div>
            <div class="catalog-grid" id="moviesCatalogGrid"></div>
        </div>
        `;
    },

    afterRender: function () {
        this.buildGrid();
    },

    buildGrid: function () {
        const el = document.getElementById("moviesCatalogGrid");
        el.innerHTML = "";
        this.moviesData.forEach((movie, i) => {
            const card = document.createElement("div");
            card.className = "poster-card " + (i === this.selectedMovie ? "active" : "");
            card.innerHTML = `
                <img src="${movie.stream_icon || ""}" onerror="this.classList.add('no-image')" />
                <div class="poster-title">${movie.name}</div>
            `;
            card.onclick = () => this.openDetail(movie);
            el.appendChild(card);
        });
        this.scrollToActive();
    },

    updateFocus: function () {
        const el = document.getElementById("moviesCatalogGrid");
        [...el.children].forEach((card, i) => {
            card.classList.toggle("active", i === this.selectedMovie);
        });
        this.scrollToActive();
    },

    scrollToActive: function () {
        const el = document.getElementById("moviesCatalogGrid");
        const active = el.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    openDetail: function (movie) {
        MovieDetail.currentItem = movie;
        Router.go("movie-detail");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedMovie = Math.min(this.selectedMovie + this.columns, this.moviesData.length - 1);
                this.updateFocus();
                break;
            case "ArrowUp":
                this.selectedMovie = Math.max(this.selectedMovie - this.columns, 0);
                this.updateFocus();
                break;
            case "ArrowRight":
                this.selectedMovie = Math.min(this.selectedMovie + 1, this.moviesData.length - 1);
                this.updateFocus();
                break;
            case "ArrowLeft":
                this.selectedMovie = Math.max(this.selectedMovie - 1, 0);
                this.updateFocus();
                break;
            case "Enter":
                const m = this.moviesData[this.selectedMovie];
                if (m) this.openDetail(m);
                break;
        }
    }
};
window.MoviesCatalog = MoviesCatalog;