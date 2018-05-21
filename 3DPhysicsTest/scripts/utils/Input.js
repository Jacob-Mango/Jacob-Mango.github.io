(function () {

    class Keyboard {
        constructor() {
            this._pressed = {};

            window.addEventListener("keyup", this.onKeyup.bind(this), false);
            window.addEventListener("keydown", this.onKeydown.bind(this), false);
        }

        isDown(keyCode) {
            return this._pressed[keyCode] && !(document.pointerLockElement == null);
        }

        onKeydown(event) {
            this._pressed[event.keyCode] = true;
        }

        onKeyup(event) {
            delete this._pressed[event.keyCode];
        }
    }

    class Mouse {
        constructor() {
            this._last = { x: 0, y: 0 };
            this._current = { x: 0, y: 0 };
            this.delta = { x: 0, y: 0 };

            window.addEventListener("mousemove", this.onMouseMove.bind(this), false);

            document.getElementsByTagName("canvas")[0].addEventListener("click", function () {
                if (document.pointerLockElement == null)
                    this.requestPointerLock();
                else
                    document.exitPointerLock();
            }, false);
        }

        Update() {
            this.delta.x = this._current.x - this._last.x;
            this.delta.y = this._current.y - this._last.y;

            this._last.x = this._current.x;
            this._last.y = this._current.y;
        }

        onMouseMove(e) {
            if (document.pointerLockElement == null) {
                this.delta.x = 0;
                this.delta.y = 0;
            } else {
                this._last.x = -e.movementX;
                this._last.y = -e.movementY;
            }
        }
    }

    window.Mouse = Mouse;
    window.Keyboard = Keyboard;
    window.KeyCodes = {
        LEFT: 65,
        FORWARD: 87,
        RIGHT: 68,
        BACKWARD: 83,
        SPACE: 32
    };
})();