#version 300 es

#ifdef GL_ES
    precision highp float;
#else
    precision mediump float;
#endif

layout(location = 0) out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D gPosition;
uniform sampler2D gNormal;
uniform sampler2D gAlbedo;
uniform sampler2D gSSAO;

#define MAX_LIGHTS 4
struct Light {
    vec3 Position;
    vec3 Color;
    
    float Linear;
    float Quadratic;
};
uniform Light uLights[MAX_LIGHTS];

uniform vec3 uViewPos;

void main() {             
    vec3 FragPos = texture(gPosition, TexCoords).rgb;
    vec3 Normal = texture(gNormal, TexCoords).rgb;
    vec3 Diffuse = texture(gAlbedo, TexCoords).rgb;
    float AmbientOcclusion = 1.0; // texture(gSSAO, TexCoords).r;
    
    vec3 ambient = vec3(0.3 * Diffuse * AmbientOcclusion);
    vec3 lighting  = ambient; 
    vec3 viewDir  = normalize(uViewPos - FragPos); 

    for (int i = 0; i < MAX_LIGHTS; i++) {
        vec3 lightDir = normalize(uLights[i].Position - FragPos);
        vec3 diffuse = max(dot(Normal, lightDir), 0.0) * Diffuse * uLights[i].Color;

        vec3 halfwayDir = normalize(lightDir + viewDir);  
        float spec = pow(max(dot(Normal, halfwayDir), 0.0), 8.0);
        vec3 specular = uLights[i].Color * spec;

        float distance = length(uLights[i].Position - FragPos);
        float attenuation = 1.0 / (1.0 + uLights[i].Linear * distance + uLights[i].Quadratic * distance * distance);

        diffuse *= attenuation;
        specular *= attenuation;
        lighting += diffuse + specular;
    }

    FragColor = vec4(ambient + vec3(0.1), 1.0);
}