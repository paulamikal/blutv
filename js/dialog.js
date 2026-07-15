const Dialog = {
    buttons: [],
    selectedIndex: 0,
    keyHandler: null,

    init: function () {
        const el = document.createElement("div");
        el.id = "app-dialog";
        el.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        el.innerHTML = `
            <div id="dialog-box" style="
                background: var(--surface-2);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                padding: 36px 44px;
                min-width: 400px;
                text-align: center;
                font-family: sans-serif;
                box-shadow: 0 24px 60px rgba(0,0,0,0.5);
            ">
                <h2 id="dialog-title" style="margin: 0 0 12px 0; color: var(--text); font-size: 22px; font-weight: 800;"></h2>
                <p id="dialog-message" style="margin: 0 0 28px 0; color: var(--text-secondary);"></p>
                <div id="dialog-buttons" style="display: flex; gap: 16px; justify-content: center;"></div>
            </div>
        `;
        document.body.appendChild(el);
    },

    show: function ({ title = "", message = "", buttons = [] }) {
        AppState.dialogOpen = true;
        this.buttons = buttons;
        this.selectedIndex = 0;

        document.getElementById("dialog-title").innerText = title;
        document.getElementById("dialog-message").innerText = message;

        const container = document.getElementById("dialog-buttons");
        container.innerHTML = "";
        buttons.forEach((btn, i) => {
            const b = document.createElement("button");
            b.innerText = btn.label;
            b.style.cssText = `
                padding: 12px 28px;
                border-radius: 30px;
                border: 1px solid transparent;
                background: rgba(255,255,255,0.06);
                color: var(--text);
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s var(--ease-tv);
            `;
            b.onclick = () => this.select(i);
            container.appendChild(b);
        });

        document.getElementById("app-dialog").style.display = "flex";
        this.updateFocus();
        this.bindKeys();
    },

    updateFocus: function () {
        const container = document.getElementById("dialog-buttons");
        [...container.children].forEach((el, i) => {
            if (i === this.selectedIndex) {
                el.style.background = "var(--surface)";
                el.style.borderColor = "rgba(255,255,255,0.3)";
                el.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.9)";
            } else {
                el.style.background = "rgba(255,255,255,0.06)";
                el.style.borderColor = "transparent";
                el.style.boxShadow = "none";
            }
        });
    },

    bindKeys: function () {
        this.keyHandler = (e) => {
            switch (e.key) {
                case "ArrowRight":
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.buttons.length - 1);
                    this.updateFocus();
                    break;
                case "ArrowLeft":
                    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                    this.updateFocus();
                    break;
                case "Enter":
                    this.select(this.selectedIndex);
                    break;
            }
        };
        document.addEventListener("keydown", this.keyHandler);
    },

    select: function (index) {
        const btn = this.buttons[index];
        this.close();
        if (btn && btn.action) {
            btn.action();
        }
    },

    close: function () {
        AppState.dialogOpen = false;
        const el = document.getElementById("app-dialog");
        if (el) el.style.display = "none";
        if (this.keyHandler) {
            document.removeEventListener("keydown", this.keyHandler);
            this.keyHandler = null;
        }
    }
};
window.Dialog = Dialog;