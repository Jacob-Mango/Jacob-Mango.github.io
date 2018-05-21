#version 300 es

#ifdef GL_ES
    precision highp float;
#else
    precision mediump float;
#endif

layout(location = 0) in vec3 aVertexPosition;
layout(location = 1) in vec3 aVertexNormal;
layout(location = 2) in vec2 aTextureCoord;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

out vec2 vTextureCoord;
out vec3 vTransformedNormal;
out vec4 vPosition;

void main(void) {
    vPosition = uMMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * uVMatrix * vPosition;

    vTextureCoord = aTextureCoord;

    vTransformedNormal = uNMatrix * aVertexNormal;
}
