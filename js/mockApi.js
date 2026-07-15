const MockAPI = {
    async login() {
        return {
            user_info: {
                username: "demo",
                status: "Active",
                auth: 1
            },
            server_info: {
                url: "mock-server",
                port: "0"
            }
        };
    },

    async getLiveCategories() {
        return [
            { category_id: "1", category_name: "Chile" },
            { category_id: "2", category_name: "Mundial 2026" },
            { category_id: "3", category_name: "Cine" },
            { category_id: "4", category_name: "Nacionales" },
            { category_id: "5", category_name: "Noticieros" },
            { category_id: "6", category_name: "TV USA" },
            { category_id: "7", category_name: "Deportes" },
            { category_id: "8", category_name: "Infantil" }
        ];
    },

    async getLiveStreams(categoryId) {
        const list = [];
        for (let i = 1; i <= 15; i++) {
            list.push({
                stream_id: 9000 + i,
                name: `Canal Demo ${i} (cat ${categoryId})`,
                category_id: categoryId
            });
        }
        return list;
    },

    async getVodCategories() {
        return [
            { category_id: "1", category_name: "Estrenos 2026" },
            { category_id: "2", category_name: "Acción" },
            { category_id: "3", category_name: "Comedia" },
            { category_id: "4", category_name: "Terror" },
            { category_id: "5", category_name: "Animación" },
            { category_id: "6", category_name: "Documentales" },
            { category_id: "7", category_name: "Clásicos" },
            { category_id: "8", category_name: "Familiares" }
        ];
    },

    async getVodStreams(categoryId) {
        const list = [];
        for (let i = 1; i <= 16; i++) {
            list.push({
                stream_id: 5000 + i,
                name: `Película Demo ${i}`,
                stream_icon: `https://picsum.photos/seed/movie${i}/300/450`,
                container_extension: "mp4",
                category_id: categoryId
            });
        }
        return list;
    },

    async getVodInfo(vodId) {
        return {
            info: {
                plot: "Esta es una descripción de prueba generada por el mock local, sin conexión a ningún servidor real."
            }
        };
    },

    async getSeriesCategories() {
        return [
            { category_id: "1", category_name: "Series Nuevas" },
            { category_id: "2", category_name: "Drama" },
            { category_id: "3", category_name: "Comedia" },
            { category_id: "4", category_name: "Anime" },
            { category_id: "5", category_name: "Documentales" },
            { category_id: "6", category_name: "Crimen" },
            { category_id: "7", category_name: "Ciencia Ficción" },
            { category_id: "8", category_name: "Clásicas" }
        ];
    },

    async getSeries(categoryId) {
        const list = [];
        for (let i = 1; i <= 16; i++) {
            list.push({
                series_id: 7000 + i,
                name: `Serie Demo ${i}`,
                cover: `https://picsum.photos/seed/serie${i}/300/450`,
                category_id: categoryId
            });
        }
        return list;
    },

    async getSeriesInfo(seriesId) {
        return {
            info: {
                plot: "Descripción de prueba para la serie demo."
            },
            seasons: [
                { season_number: 1, name: "Temporada 1" },
                { season_number: 2, name: "Temporada 2" }
            ],
            episodes: {
                "1": [
                    { id: 8001, episode_num: 1, title: "Episodio 1", container_extension: "mp4" },
                    { id: 8002, episode_num: 2, title: "Episodio 2", container_extension: "mp4" }
                ],
                "2": [
                    { id: 8003, episode_num: 1, title: "Episodio 1", container_extension: "mp4" }
                ]
            }
        };
    }
};
window.MockAPI = MockAPI;