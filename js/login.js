const Login = {
    focusIndex: 0,
    fields: ["server", "user", "pass", "btnLogin"],

    render: function () {
        return `
        <div class="login-screen">
            <div class="home-ambient">
                <div class="home-blob blob-a"></div>
                <div class="home-blob blob-b"></div>
            </div>
            <div class="home-vignette"></div>

            <div class="login-card">
                <div class="brand" style="margin-bottom:36px;">
                    <div class="mark">B</div>
                    <div class="word">Blu<span>TV</span></div>
                </div>
                <input id="server" placeholder="Servidor" class="login-input">
                <input id="user" placeholder="Usuario" class="login-input">
                <input id="pass" type="password" placeholder="Contraseña" class="login-input">
                <button id="btnLogin" onclick="Login.doLogin()" class="login-button">Conectar</button>
                <p id="status" class="login-status"></p>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        this.focusIndex = 0;
        this.updateFocus();
    },

    init: function () {
        if (!Storage.hasLogin()) {
            return;
        }
        const login = Storage.getLogin();
        document.getElementById("server").value = login.server;
        document.getElementById("user").value = login.username;
        document.getElementById("pass").value = login.password;
    },

    updateFocus: function () {
        this.fields.forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.toggle("active", i === this.focusIndex);
            if (i === this.focusIndex) {
                el.focus();
            }
        });
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.focusIndex = Math.min(this.focusIndex + 1, this.fields.length - 1);
                this.updateFocus();
                break;
            case "ArrowUp":
                this.focusIndex = Math.max(this.focusIndex - 1, 0);
                this.updateFocus();
                break;
            case "Enter":
                if (this.fields[this.focusIndex] === "btnLogin") {
                    this.doLogin();
                }
                break;
        }
    },

    async doLogin(auto = false) {
        const server = document.getElementById("server").value.trim();
        const user = document.getElementById("user").value.trim();
        const pass = document.getElementById("pass").value.trim();
        const status = document.getElementById("status");
        if (!server || !user || !pass) {
            status.innerText = "Completa todos los campos";
            return;
        }
        status.innerText = auto ? "Iniciando sesión..." : "Conectando...";
        try {
            const ok = await Session.login(server, user, pass);
            if (!ok) {
                status.innerText = "Usuario o contraseña incorrectos";
                if (auto) {
                    Session.logout();
                }
                return;
            }
            Router.go("home");
        } catch (e) {
            status.innerText = "Error de conexión";
        }
    }
};
window.Login = Login;