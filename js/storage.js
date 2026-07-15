const Storage = {
    saveLogin(server, username, password) {
        localStorage.setItem("server", server);
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    },

    getLogin() {
        return {
            server: localStorage.getItem("server") || "",
            username: localStorage.getItem("username") || "",
            password: localStorage.getItem("password") || ""
        };
    },

    hasLogin() {
        const login = this.getLogin();
        return (
            login.server !== "" &&
            login.username !== "" &&
            login.password !== ""
        );
    },
    
    clearLogin() {
        localStorage.removeItem("server");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
    }

};
window.Storage = Storage;