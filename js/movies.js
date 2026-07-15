const Movies = {
    categories: [],
    selectedCategory: 0,
    columns: 3,

    init: async function () {
        try {
            const cats = await API.getVodCategories();
            this.categories = cats || [];
            if (this.selectedCategory >= this.categories.length) {
                this.selectedCategory = 0;
            }
            this.refresh();
        } catch (e) {
            console.log("INIT MOVIES ERROR", e);
        }
    },

    render: function () {
        return `
        <div class="live">
            <div class="live-header">
                <h2>PELÍCULAS</h2>
            </div>
            <div class="live-categories-grid" id="movieCatGrid"></div>
        </div>
        `;
    },

    afterRender: function () {
        this.refresh();
    },

    refresh: function () {
        const el = document.getElementById("movieCatGrid");
        el.innerHTML = "";
        this.categories.forEach((cat, i) => {
            const div = document.createElement("div");
            div.className = "category-tile " + (i === this.selectedCategory ? "active" : "");
            div.innerText = cat.category_name;
            div.onclick = () => this.openCategory(cat);
            el.appendChild(div);
        });
        const active = el.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    openCategory: function (cat) {
        MoviesCatalog.categoryId = cat.category_id;
        MoviesCatalog.categoryName = cat.category_name;
        Router.go("movies-catalog");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedCategory = Math.min(this.selectedCategory + this.columns, this.categories.length - 1);
                this.refresh();
                break;
            case "ArrowUp":
                this.selectedCategory = Math.max(this.selectedCategory - this.columns, 0);
                this.refresh();
                break;
            case "ArrowRight":
                this.selectedCategory = Math.min(this.selectedCategory + 1, this.categories.length - 1);
                this.refresh();
                break;
            case "ArrowLeft":
                this.selectedCategory = Math.max(this.selectedCategory - 1, 0);
                this.refresh();
                break;
            case "Enter":
                const cat = this.categories[this.selectedCategory];
                if (cat) this.openCategory(cat);
                break;
        }
    }
};
window.Movies = Movies;