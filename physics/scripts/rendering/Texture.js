(function () {

    class Texture {
        constructor(file) {
            this.texture = this.gl.createTexture();
            this.texture.image = new Image();
            this.texture.image.onload = this.OnLoad();
            this.texture.image.src = file;
        }

        OnLoad() {
            self.gl.pixelStorei(self.gl.UNPACK_FLIP_Y_WEBGL, true);
            self.gl.bindTexture(self.gl.TEXTURE_2D, this.texture);
            self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, this.texture.image);
            self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.LINEAR);
            self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.LINEAR_MIPMAP_NEAREST);
            self.gl.generateMipmap(self.gl.TEXTURE_2D);

            self.gl.bindTexture(self.gl.TEXTURE_2D, null);
        }
    };

    window.Texture = Texture;
})();
