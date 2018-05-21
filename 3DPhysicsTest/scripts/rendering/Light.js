(function () {

    class Light {
        constructor() {
            this.position = [0, 0, 0];
            this.diffuse = [0, 0, 0];
            this.linear = 0;
            this.quadratic = 0;
        }

        Update(gl) {
            gl.uniform3f(this.uPos, this.position[0], this.position[1], this.position[2]);
            gl.uniform3f(this.uDiff, this.diffuse[0], this.diffuse[1], this.diffuse[2]);
            gl.uniform1f(this.uLinear, this.linear);
            gl.uniform1f(this.uQuadratic, this.quadratic);
        }
    }
    window.Light = Light;
})();