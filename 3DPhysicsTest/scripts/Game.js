(function () {

    class Game {
        constructor() {
            this.renderer = new window.Renderer("canvas");
        }

        Tick() {
            var self = this;
            window.requestAnimFrame(function () {
                self.Tick();
            });
            this.renderer.Render();
        }

        Start() {
            this.renderer.Start();

            this.Tick();
        }
    };

    window.Game = Game;
})();

function BoolTrue(bool) {
    return typeof bool !== 'undefined' && bool;
}
