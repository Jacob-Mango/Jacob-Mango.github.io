(function () {

    class Camera {
        constructor() {
            this.vMatrix = mat4.create();

            this.position = [0, 0, 0];
            this.rotation = { x: 0, y: 0, z: 0 };

            this.keyboard = new w.Keyboard();
            this.mouse = new w.Mouse();
        }

        Update() {
            this.mouse.Update();

            var speed = 0.1;

            var mouseSensitivity = 0.01;

            this.rotation.y += this.mouse.delta.x * mouseSensitivity;
            this.rotation.x += this.mouse.delta.y * mouseSensitivity;

            if (this.rotation.x >= Math.PI / 2) this.rotation.x = -Math.PI / 2;
            if (-Math.PI / 2 >= this.rotation.x) this.rotation.x = Math.PI / 2;

            if (this.keyboard.isDown(w.KeyCodes.FORWARD)) {
                this.position[0] += speed * Math.sin(-this.rotation.y);
                this.position[2] += speed * Math.cos(-this.rotation.y);
            } else if (this.keyboard.isDown(w.KeyCodes.BACKWARD)) {
                this.position[0] += speed * Math.sin(-this.rotation.y + Math.PI);
                this.position[2] += speed * Math.cos(-this.rotation.y + Math.PI);
            }

            if (this.keyboard.isDown(w.KeyCodes.LEFT)) {
                this.position[0] += speed * Math.sin(-this.rotation.y + (Math.PI / 2.0));
                this.position[2] += speed * Math.cos(-this.rotation.y + (Math.PI / 2.0));
            } else if (this.keyboard.isDown(w.KeyCodes.RIGHT)) {
                this.position[0] += speed * Math.sin(-this.rotation.y - (Math.PI / 2.0));
                this.position[2] += speed * Math.cos(-this.rotation.y - (Math.PI / 2.0));
            }
        }

        ToRad(degrees) {
            return degrees * Math.PI / 180;
        }

        GetTransformation() {
            mat4.identity(this.vMatrix);
            mat4.translate(this.vMatrix, this.position);

            var rotMatrix = mat4.create();
            mat4.identity(rotMatrix);
            mat4.rotate(rotMatrix, this.rotation.x, [1, 0, 0]);
            mat4.rotate(rotMatrix, this.rotation.y, [0, 1, 0]);
            mat4.rotate(rotMatrix, this.rotation.z, [0, 0, 1]);

            mat4.multiply(rotMatrix, this.vMatrix, this.vMatrix);
            return this.vMatrix;
        }
    };

    window.Camera = Camera;
})();