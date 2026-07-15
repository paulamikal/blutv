const Splash = {
    render: function () {
        return `
        <div class="splash-screen">
            <div class="home-ambient">
                <div class="home-blob blob-a"></div>
                <div class="home-blob blob-b"></div>
            </div>
            <div class="home-vignette"></div>
            <div class="brand" style="margin-bottom:0;">
                <div class="mark pulse-mark">B</div>
                <div class="word">Blu<span>TV</span></div>
            </div>
        </div>
        `;
    }
};
window.Splash = Splash;