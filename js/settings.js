const Settings = {
    selectedIndex: 0,
    options: [
        { label: "Cerrar sesión", action: "logout" },
        { label: "Borrar credenciales", action: "forget" }
    ],

    render: function () {
        return `
        <div class="settings-screen">
            <div class="settings-header">
                <h2 class="settings-title">AJUSTES</h2>
            </div>
            <div class="settings-body">
                <div class="menu" id="settingsMenu"></div>
                <p class="settings-version">BluTV v0.1.0 (beta)</p>
            </div>
        </div>
        `;
    },

    afterRender: function () {
        this.selectedIndex = 0;
        this.buildMenu();
    },

    buildMenu: function () {
        const el = document.getElementById("settingsMenu");
        el.innerHTML = "";
        this.options.forEach((opt, i) => {
            const div = document.createElement("div");
            div.className = i === this.selectedIndex ? "active" : "";
            div.innerText = opt.label;
            div.onclick = () => this.select(i);
            el.appendChild(div);
        });
    },

    updateFocus: function () {
        const el = document.getElementById("settingsMenu");
        [...el.children].forEach((item, i) => {
            item.classList.toggle("active", i === this.selectedIndex);
        });
    },

    handleKey: function (key) {
        switch (key) {
            case "ArrowDown":
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.options.length - 1);
                this.updateFocus();
                break;
            case "ArrowUp":
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateFocus();
                break;
            case "Enter":
                this.select(this.selectedIndex);
                break;
        }
    },

    select: function (index) {
        const opt = this.options[index];
        if (!opt) return;

        if (opt.action === "logout") {
            Dialog.show({
                title: "Cerrar sesión",
                message: "¿Deseas cerrar la sesión actual?",
                buttons: [
                    { label: "Cancelar", action: () => {} },
                    { label: "Cerrar sesión", action: () => {
                        Session.logout();
                        Router.go("login");
                    }}
                ]
            });
        }

        if (opt.action === "forget") {
            Dialog.show({
                title: "Borrar credenciales",
                message: "Esto eliminará tus datos guardados. Deberás iniciar sesión manualmente la próxima vez. ¿Continuar?",
                buttons: [
                    { label: "Cancelar", action: () => {} },
                    { label: "Borrar", action: () => {
                        Storage.clearLogin();
                        Session.logout();
                        Router.go("login");
                    }}
                ]
            });
        }
    }
};
window.Settings = Settings;