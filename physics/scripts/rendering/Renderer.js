(function () {

    class Renderer {
        constructor(id) {
            this.canvas = document.getElementById(id);

            this.models = [];
            this.textures = [];

            this.objects = [];

            this.vMatrix = mat4.create();
            this.pMatrix = mat4.create();

            this.camera = new w.Camera();
        }

        InitGL() {
            try {
                this.gl = this.context = WebGLUtils.setupWebGL(this.canvas);
                this.gl.viewportWidth = this.canvas.width;
                this.gl.viewportHeight = this.canvas.height;

                this.gl.enable(this.gl.DEPTH_TEST);
                //this.gl.enable(this.gl.CULL_FACE);
                this.gl.frontFace(this.gl.CL_CW);
                //this.gl.cullFace(this.gl.BACK);

                window.gl = this.gl;

                this.mvMatrix = mat4.create();
                this.mvMatrixStack = [];
                this.pMatrix = mat4.create();
            } catch (e) {}
            if (!this.gl) {
                alert("Could not initialise WebGL, sorry :-(");
            }
        }

        SetupLightingShader(shader) {
            this.gl.useProgram(shader.program);

            shader.program.vertexPositionAttribute = this.gl.getAttribLocation(shader.program, "aPos");
            this.gl.enableVertexAttribArray(shader.program.vertexPositionAttribute);
            shader.program.textureCoordAttribute = this.gl.getAttribLocation(shader.program, "aTexCoords");
            this.gl.enableVertexAttribArray(shader.program.textureCoordAttribute);

            shader.program.viewPosition = this.gl.getUniformLocation(shader.program, "uViewPos");
            shader.program.pMatrixUniform = this.gl.getUniformLocation(shader.program, "uPMatrix");

            shader.program.lights = [];
            for (var i = 0; i < 4; i++) {
                var light = new w.Light();
                light.uPos = this.gl.getUniformLocation(shader.program, "uLights[" + i + "].Position");
                light.uDiff = this.gl.getUniformLocation(shader.program, "uLights[" + i + "].Color");
                light.uLinear = this.gl.getUniformLocation(shader.program, "uLights[" + i + "].Linear");
                light.uQuadratic = this.gl.getUniformLocation(shader.program, "uLights[" + i + "].Quadratic");
                shader.program.lights.splice(i, 0, light);
            }
        }

        SetupSSAOShader(shader) {

        }

        SetupBufferShader(shader) {
            this.gl.useProgram(shader.program);

            shader.program.vertexPositionAttribute = this.gl.getAttribLocation(shader.program, "aVertexPosition");
            this.gl.etnableVertexAttribArray(shader.program.vertexPositionAttribute);

            shader.program.vertexNormalAttribute = this.gl.getAttribLocation(shader.program, "aVertexNormal");
            this.gl.enableVertexAttribArray(shader.program.vertexNormalAttribute);

            shader.program.textureCoordAttribute = this.gl.getAttribLocation(shader.program, "aTextureCoord");
            this.gl.enableVertexAttribArray(shader.program.textureCoordAttribute);

            shader.program.pMatrixUniform = this.gl.getUniformLocation(shader.program, "uPMatrix");
            shader.program.vMatrixUniform = this.gl.getUniformLocation(shader.program, "uVMatrix");
            shader.program.mMatrixUniform = this.gl.getUniformLocation(shader.program, "uMMatrix");
            shader.program.nMatrixUniform = this.gl.getUniformLocation(shader.program, "uNMatrix");
        }

        InitShaders() {
            this.lightingShader = new w.Shader(this.gl, "lighting", this.SetupLightingShader);
            this.bufferShader = new w.Shader(this.gl, "framebuffer", this.SetupBufferShader);
            //this.ssaoShader = new w.Shader(this.gl, "ssao", this.SetupSSAOShader);
        }

        CreateScreenBuffer() {
            var z = 0;

            var d = this.gl.viewportWidth;
            var h = this.gl.viewportHeight;

            var a = 1; // w / h;

            var data = {
                id: 0,
                vertexPositions: [ //
                    -1 * a, -1 * a, z, //
                    -1 * a, +1 * a, z, //
                    +1 * a, -1 * a, z, //
                    +1 * a, +1 * a, z //
                ],
                vertexNormals: [ //
                    0.0, 1.0, 0.0, //
                    0.0, 1.0, 0.0, //
                    0.0, 1.0, 0.0, //
                    0.0, 1.0, 0.0 //
                ],
                vertexTextureCoords: [
                    0.0, 0.0,
                    0.0, 1.0,
                    1.0, 0.0,
                    1.0, 1.0,
                ],
                indices: [
                    2, 1, 0, 2, 3, 1
                ]
            }

            var model = new w.Model(this.gl, data);
            var id = model.identifier;
            this.models[id] = model;

            this.frameTarget = new w.Framebuffer(this.gl, this.gl.viewportWidth, this.gl.viewportHeight);
        }

        Start() {
            this.InitGL();
            this.InitShaders();

            this.CreateScreenBuffer();

            this.LoadModel("models/macbook.json");

            this.objects.push(new w.Object(0));
            this.time = 0;
        }

        LoadModel(file) {
            w.Model.LoadFromFile(this.gl, file, this.models)
        }

        RenderScene() {
            var gl = this.gl,
                shader = this.bufferShader;
            if (shader.program === undefined) return;

            this.frameTarget.Bind();

            this.gl.clearColor(0.0, 1.0, 0.0, 1.0);
            this.Clear();

            shader.Bind();

            mat4.identity(this.pMatrix);
            mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, this.pMatrix);

            var cameraTransform = this.camera.GetTransformation();

            gl.uniformMatrix4fv(shader.program.pMatrixUniform, false, this.pMatrix);
            gl.uniformMatrix4fv(shader.program.vMatrixUniform, false, cameraTransform);

            for (var i = 0; i < this.objects.length; i++) {
                var object = this.objects[i],
                    model = this.models[object.modelID];

                if (typeof model !== 'undefined' && !BoolTrue(model.hasLoaded)) continue;

                object.Update();

                var transform = object.GetTransformation();
                gl.uniformMatrix4fv(shader.program.mMatrixUniform, false, transform);

                var normalMatrix = mat3.create();
                mat4.toInverseMat3(transform, normalMatrix);
                mat3.transpose(normalMatrix);
                gl.uniformMatrix3fv(shader.program.nMatrixUniform, false, normalMatrix);

                gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
                gl.vertexAttribPointer(shader.program.vertexPositionAttribute, model.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordBuffer);
                gl.vertexAttribPointer(shader.program.textureCoordAttribute, model.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
                gl.vertexAttribPointer(shader.program.vertexNormalAttribute, model.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
                gl.drawElements(gl.TRIANGLES, model.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }

            this.frameTarget.Unbind();
            shader.Unbind();
        }

        UpdateLights() {
            this.lightingShader.program.lights[0].position[0] += Math.cos(this.time += 0.05) * 0.2;
            this.lightingShader.program.lights[0].diffuse[0] = 1;
            this.lightingShader.program.lights[0].linear = 0.09;
            this.lightingShader.program.lights[0].quadratic = 0.032;
        }

        RenderFramebuffer() {
            var gl = this.gl,
                model = this.models[0],
                shader = this.lightingShader;
            if (shader.program === undefined) return;

            shader.Bind();
            this.Clear();

            gl.uniform3f(shader.program.viewPosition, this.camera.position[0], this.camera.position[1], this.camera.position[2]);

            for (var i = 0; i < 4; i++) {
                shader.program.lights[i].Update(gl);
            }

            this.UpdateLights();

            this.frameTarget.Use();

            gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
            gl.vertexAttribPointer(shader.program.vertexPositionAttribute, model.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordBuffer);
            gl.vertexAttribPointer(shader.program.textureCoordAttribute, model.textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
            gl.drawElements(gl.TRIANGLES, model.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        }

        Render() {
            this.camera.Update();

            this.Clear();
            this.RenderScene();
            this.RenderFramebuffer();
        }

        Clear() {
            this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            this.gl.activeTexture(gl.TEXTURE0);
            this.gl.bindTexture(gl.TEXTURE_2D, null);
            this.gl.activeTexture(gl.TEXTURE1);
            this.gl.bindTexture(gl.TEXTURE_2D, null);
            this.gl.activeTexture(gl.TEXTURE2);
            this.gl.bindTexture(gl.TEXTURE_2D, null);
            
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        }
    };


    window.Renderer = Renderer;
})();