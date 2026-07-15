const USE_MOCK_DATA = false;   // cambiar a false para volver a datos reales

window.API = {
    buildBase() {
        const credentials = Session.credentials;
        return `${credentials.server}/player_api.php?username=${credentials.username}&password=${credentials.password}`;
    },
    async request(url) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        return await res.json();
    },
    async login(server, username, password) {
        if (USE_MOCK_DATA) return MockAPI.login();
        const url =
            `${server}/player_api.php?username=${username}&password=${password}`;
        return await this.request(url);
    },
    async getLiveCategories() {
        if (USE_MOCK_DATA) return MockAPI.getLiveCategories();
        return await this.request(
            this.buildBase() +
            "&action=get_live_categories"
        );
    },
    async getLiveStreams(categoryId) {
        if (USE_MOCK_DATA) return MockAPI.getLiveStreams(categoryId);
        return await this.request(
            this.buildBase() +
            "&action=get_live_streams&category_id=" + categoryId
        );
    },
    async getVodCategories() {
        if (USE_MOCK_DATA) return MockAPI.getVodCategories();
        return await this.request(
            this.buildBase() +
            "&action=get_vod_categories"
        );
    },
    async getVodStreams(categoryId) {
        if (USE_MOCK_DATA) return MockAPI.getVodStreams(categoryId);
        return await this.request(
            this.buildBase() +
            "&action=get_vod_streams&category_id=" + categoryId
        );
    },
    async getVodInfo(vodId) {
        if (USE_MOCK_DATA) return MockAPI.getVodInfo(vodId);
        return await this.request(
            this.buildBase() +
            "&action=get_vod_info&vod_id=" + vodId
        );
    },
    async getSeriesCategories() {
        if (USE_MOCK_DATA) return MockAPI.getSeriesCategories();
        return await this.request(
            this.buildBase() +
            "&action=get_series_categories"
        );
    },
    async getSeries(categoryId) {
        if (USE_MOCK_DATA) return MockAPI.getSeries(categoryId);
        return await this.request(
            this.buildBase() +
            "&action=get_series&category_id=" + categoryId
        );
    },
    async getSeriesInfo(seriesId) {
        if (USE_MOCK_DATA) return MockAPI.getSeriesInfo(seriesId);
        return await this.request(
            this.buildBase() +
            "&action=get_series_info&series_id=" + seriesId
        );
    }
};