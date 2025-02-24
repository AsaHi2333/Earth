#version 450 core

in vec2 TextCoords;
in vec3 FragPosition; 
in vec3 Normal; 
in vec4 FragPosLightSpace; // 从顶点着色器传来的，包含变换到光源空间的位置

out vec4 fragmentColor;

uniform sampler2D earth;
uniform sampler2D specularMap;
uniform sampler2D shadowMap; // 阴影贴图
uniform vec3 lightPos;
uniform vec3 viewPos;
uniform mat4 view;
uniform mat4 lightSpaceMatrix; // 光源空间矩阵
uniform float constant;
uniform float linear;
uniform float quadratic;

// PCSS parameters
const float blockerSearchNumSteps = 16;
const float blockerSearchThreshold = 0.01;
const float pcfNumSteps = 16;
const vec2 pcfOffset = vec2(0.0, 0.0); // Will be computed in the shader based on resolution

// For point light
uniform float lightFarPlane;

void main()
{
    // Ambient lighting
    float ambientStrength = 0.3;
    vec3 ambient = ambientStrength * vec3(texture(earth, TextCoords));
    
    // Diffuse lighting
    vec3 LightPos = vec3(view * vec4(lightPos, 1.0));
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(LightPos - FragPosition);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * vec3(texture(earth, TextCoords));
    
    // Specular lighting
    float specularStrength = 0.3;
    vec3 ViewPos = vec3(view * vec4(viewPos, 1.0));
    vec3 viewDir = normalize(ViewPos - FragPosition);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = specularStrength * spec * vec3(texture(specularMap, TextCoords));
    
    // Point light attenuation
    float distance = length(LightPos - FragPosition);
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));
    
    // Shadow calculation using PCSS
    vec3 projCoords = FragPosLightSpace.xyz;
    float closestDepth = texture(shadowMap, projCoords.xy).r; 
    float currentDepth = projCoords.z;
    float shadow = 0.0;
    
    // Blocker search
    float range = (currentDepth - closestDepth) / blockerSearchThreshold;
    int count = 0;
    for (int i = -blockerSearchNumSteps; i <= blockerSearchNumSteps; ++i) {
        if (i == 0) continue;
        float closestDepthSample = texture(shadowMap, projCoords.xy + pcfOffset * (i / float(blockerSearchNumSteps))).r; 
        if (closestDepthSample < (projCoords.z - blockerSearchThreshold)) {
            count++;
        }
    }
    float avgBlockerDepth = count / float(blockerSearchNumSteps * 2 + 1);
    
    // Penumbra size
    float penumbraSize = (avgBlockerDepth - projCoords.z) * (lightFarPlane - projCoords.z);
    
    // Percentage closer filtering
    for (int x = -pcfNumSteps; x <= pcfNumSteps; ++x) {
        for (int y = -pcfNumSteps; y <= pcfNumSteps; ++y) {
            float closestDepthSample = texture(shadowMap, projCoords.xy + vec2(x, y) * pcfOffset).r; 
            if (closestDepthSample < projCoords.z) {
                shadow += 1.0;
            }
        }
    }
    shadow /= (pcfNumSteps * 2 + 1) * (pcfNumSteps * 2 + 1);
    shadow = clamp(shadow, 0.0, 1.0);
    
    // Apply penumbra size to shadow
    shadow = softShadow(currentDepth, closestDepth, penumbraSize, shadow);
    
    // Final color with shadow
    fragmentColor = vec4(attenuation * (ambient + diffuse + specular) * shadow, 1.0);
}

// Soft shadow function
float softShadow(float currentDepth, float closestDepth, float penumbraSize, float shadow) {
    if (currentDepth < closestDepth) {
        return 1.0;
    } else {
        float depthDifference = currentDepth - closestDepth;
        float softness = smoothstep(0.0, penumbraSize, depthDifference);
        return mix(1.0, shadow, softness);
    }
}