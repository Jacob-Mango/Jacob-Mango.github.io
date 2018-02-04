(function () {

    class Object {
        constructor(modelID) {
            this.modelID = modelID;

            this.mMatrix = mat4.create();

            this.position = [0, -1, 0];
            this.rotation = { x: -90, y: 0, z: 0 };
        }

        Update() {
            // this.rotation.y += 0.2;
        }

        ToRad(degrees) {
            return degrees * Math.PI / 180;
        }

        GetTransformation() {
            mat4.identity(this.mMatrix);

            mat4.translate(this.mMatrix, this.position);
            mat4.rotate(this.mMatrix, this.ToRad(this.rotation.z), [0, 0, 1]);
            mat4.rotate(this.mMatrix, this.ToRad(this.rotation.y), [0, 1, 0]);
            mat4.rotate(this.mMatrix, this.ToRad(this.rotation.x), [1, 0, 0]);

            return this.mMatrix;
        }
    };

    window.Object = Object;
})();
