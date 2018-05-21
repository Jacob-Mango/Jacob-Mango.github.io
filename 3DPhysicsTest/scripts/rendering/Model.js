(function () {

    class Model {
        constructor(gl, data) {
            this.gl = gl;
            this.hasLoaded = false;
            this.identifier = -1;

            if (data !== undefined)
                this.OnLoad(data);
        }

        OnLoad(data) {
            if (typeof data.vertexNormals !== "undefined") {
                this.normalBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexNormals), this.gl.STATIC_DRAW);
                this.normalBuffer.itemSize = 3;
                this.normalBuffer.numItems = data.vertexNormals.length / 3;
            }

            if (typeof data.vertexTextureCoords !== "undefined") {
                this.textureCoordBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexTextureCoords), this.gl.STATIC_DRAW);
                this.textureCoordBuffer.itemSize = 2;
                this.textureCoordBuffer.numItems = data.vertexTextureCoords.length / 2;
            }

            if (typeof data.vertexPositions !== "undefined") {
                this.vertexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data.vertexPositions), this.gl.STATIC_DRAW);
                this.vertexBuffer.itemSize = 3;
                this.vertexBuffer.numItems = data.vertexPositions.length / 3;
            }

            if (typeof data.indices !== "undefined") {
                this.indexBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), this.gl.STREAM_DRAW);
                this.indexBuffer.itemSize = 1;
                this.indexBuffer.numItems = data.indices.length;
            }

            this.identifier = data.id;

            this.hasLoaded = true;
        }
    };

    Model.LoadFromFile = function (gl, file, models) {
        var model = new Model(gl);

        var request = new XMLHttpRequest();
        request.open("GET", file);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                model.OnLoad(JSON.parse(request.responseText));
                models[model.identifier] = model;
            }
        }
        request.send();

        return model;
    };

    window.Model = Model;
})();