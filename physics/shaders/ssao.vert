#version 300 es

#ifdef GL_ES
    precision highp float;
#else
    precision mediump float;
#endif

layout(location = 0) in vec3 aVertexPosition;
layout(location = 1) in vec2 aTextureCoord;

out vec2 TexCoords;

void main() {
    TexCoords = aTextureCoord;
    gl_Position = vec4(aVertexPosition, 1.0);
}