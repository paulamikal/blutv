const Live = {
    categories: [],
    selectedCategory: 0,
    columns: 3,

    init: async function () {
        try {
            const cats = await API.getLiveCategories();
            this.categories = cats || [];
            if (this.selectedCategory >= this.categories.length) {
                this.selectedCategory = 0;
            }
            this.buildGrid();
        } catch (e) {
            console.log("INIT LIVE ERROR", e);
        }
    },

    render: function () {
        return `
        <div class="live">
            <div class="live-header">
                <h2>TV EN VIVO</h2>
            </div>
            <div class="live-categories-grid" id="catGrid"></div>
        </div>
        `;
    },

    afterRender: function () {
        this.buildGrid();
    },

    buildGrid: function () {
        const el = document.getElementById("catGrid");
        el.innerHTML = "";
        this.categories.forEach((cat, i) => {
            const div = document.createElement("div");
            div.className = "category-tile " + (i === this.selectedCategory ? "active" : "");
            div.innerText = cat.category_name;
            div.onclick = () => this.openCategory(cat);
            el.appendChild(div);
        });
        this.scrollToActive();
    },

    updateFocus: function () {
        const el = document.getElementById("catGrid");
        [...el.children].forEach((tile, i) => {
            tile.classList.toggle("active", i === this.selectedCategory);
        });
        this.scrollToActive();
    },

    scrollToActive: function () {
        const el = document.getElementById("catGrid");
        const active = el.querySelector(".active");
        if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },

    openCategory: function (cat) {
        LiveChannels.categoryId = cat.category_id;
        LiveChannels.categoryName = cat.category_name;
        Router.go("live-channels");
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedCategory = Math.min(this.selectedCategory + this.columns, this.categories.length - 1);
                this.updateFocus();
                break;
            case "ArrowUp":
                this.selectedCategory = Math.max(this.selectedCategory - this.columns, 0);
                this.updateFocus();
                break;
            case "ArrowRight":
                this.selectedCategory = Math.min(this.selectedCategory + 1, this.categories.length - 1);
                this.updateFocus();
                break;
            case "ArrowLeft":
                this.selectedCategory = Math.max(this.selectedCategory - 1, 0);
                this.updateFocus();
                break;
            case "Enter":
                const cat = this.categories[this.selectedCategory];
                if (cat) this.openCategory(cat);
                break;
        }
    }
};
window.Live = Live;