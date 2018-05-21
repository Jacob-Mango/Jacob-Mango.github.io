(function () {

    var SHADER_TYPE_FRAGMENT = "x-shader/x-fragment";
    var SHADER_TYPE_VERTEX = "x-shader/x-vertex";

    var numShadersCreated = 0;

    class Shader {
        constructor(gl, name, func) {
            this.gl = gl;

            this.programCreatedHandle = func;

            this.LoadShader(name, "vert");
            this.LoadShader(name, "frag");
        }

        LoadShader(name, shaderType) {
            var self = this,
                request = new XMLHttpRequest();
            request.open('GET', "shaders/" + name + "." + shaderType);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    var src = request.responseText;

                    var shader;
                    if (shaderType == "frag") {
                        shader = self.gl.createShader(self.gl.FRAGMENT_SHADER);
                    } else if (shaderType == "vert") {
                        shader = self.gl.createShader(self.gl.VERTEX_SHADER);
                    } else {}

                    self.gl.shaderSource(shader, src);
                    self.gl.compileShader(shader);

                    if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
                        alert("Could not create vertex shader!");

                        var info = self.gl.getShaderInfoLog(shader);
                        throw 'Could not create vertex shader! \n\n' + info;
                    } else {
                        if (shaderType == "frag") {
                            self.fragmentShader = shader;
                        } else if (shaderType == "vert") {
                            self.vertexShader = shader;
                        }

                        console.log("shader " + name + " type " + shaderType);

                        if (++numShadersCreated == 2) self.CreateProgram();
                    }
                }
            }
            request.send();
        }

        CreateProgram() {
            this.program = this.gl.createProgram();
            this.gl.attachShader(this.program, this.vertexShader);
            this.gl.attachShader(this.program, this.fragmentShader);
            this.gl.linkProgram(this.program);

            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                alert("Could not initialise shaders!");

                var info = this.gl.getProgramInfoLog(this.program);
                throw 'Could not initialise shaders! \n\n' + info;
            }

            this.programCreatedHandle(this);
        }

        Bind() {
            this.gl.useProgram(this.program);
        }

        Unbind() {
            this.gl.useProgram(null);
        }
    };

    window.Shader = Shader;
})();