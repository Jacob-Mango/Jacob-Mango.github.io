#version 300 es

#ifdef GL_ES
    precision highp float;
#else
    precision mediump float;
#endif

layout(location = 0) out vec4 oPosition;
layout(location = 1) out vec4 oNormal;
layout(location = 2) out vec4 oAlbedo;

in vec2 vTextureCoord;
in vec3 vTransformedNormal;
in vec4 vPosition;

void main() {    
    oPosition = vPosition;
    oNormal = vec4(normalize(vTransformedNormal), 0);
    oAlbedo = vec4(1.0, 1.0, 1.0, 1.0);
}