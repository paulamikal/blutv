const Session ={
    credentials: null,
    user: null,
    server: null,
    async login(server, username, password) {

        const data = await API.login(
            server,
            username,
            password
        );
        if (!data || !data.user_info) {
            return false;
        }
        this.credentials = {
            server,
            username,
            password
        };
        this.user = data.user_info;
        this.server = data.server_info;
        Storage.saveLogin(
            server,
            username,
            password
        );
        return true;
    },
    restore() {
        if (!Storage.hasLogin()) {
            return false;
        }
        this.credentials = Storage.getLogin();
        return true;
    },
    logout() {
        this.credentials = null;
        this.user = null;
        this.server = null;
    }
};
window.Session = Session;