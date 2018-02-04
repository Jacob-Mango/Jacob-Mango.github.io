(function () {

    class Framebuffer {
        constructor(gl, width, height) {
            this.gl = gl;

            const ext = gl.getExtension("EXT_color_buffer_float");
            if (!ext) {
                alert("need EXT_color_buffer_float");
                return;
            }

            this.frameBuffer = gl.createFramebuffer();
            this.frameBuffer.width = width;
            this.frameBuffer.height = height;

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            this.texPosition = this.MakeTexture(gl, gl.COLOR_ATTACHMENT0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, gl.RGBA, gl.UNSIGNED_BYTE);
            this.texNormal = this.MakeTexture(gl, gl.COLOR_ATTACHMENT1, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, gl.RGBA, gl.UNSIGNED_BYTE);
            this.texAlbedo = this.MakeTexture(gl, gl.COLOR_ATTACHMENT2, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, gl.RGBA, gl.UNSIGNED_BYTE);

            this.Bind();

            this.renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
            this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.Unbind();
        }

        MakeTexture(gl, attachment, internalFormat, width, height, format, type) {
            this.Bind();
            var texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);
            this.Unbind();

            return texture;
        }

        Bind() {
            if (typeof this.frameBuffer !== "undefined")
                this.gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            if (typeof this.renderbuffer !== "undefined")
                this.gl.bindRenderbuffer(gl.FRAMEBUFFER, this.renderbuffer);
        }

        Unbind() {
            this.gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        }

        Use() {
            this.gl.activeTexture(gl.TEXTURE0);
            this.gl.bindTexture(gl.TEXTURE_2D, this.texPosition);

            this.gl.activeTexture(gl.TEXTURE1);
            this.gl.bindTexture(gl.TEXTURE_2D, this.texNormal);

            this.gl.activeTexture(gl.TEXTURE2);
            this.gl.bindTexture(gl.TEXTURE_2D, this.texAlbedo);
        }
    };

    window.Framebuffer = Framebuffer;
})();