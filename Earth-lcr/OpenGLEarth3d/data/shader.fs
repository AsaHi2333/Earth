#version 450 core

in vec2 TextCoords;
in vec3 FragPosition; 
in vec3 Normal; 

out vec4 fragmentColor;

uniform sampler2D earth;
uniform sampler2D specularMap;
uniform vec3 lightPos; 
uniform vec3 viewPos;
uniform mat4 view;

//For point light
uniform float constant;
uniform float linear;
uniform float quadratic;

// 添加透明度控制
float transparency=0.7f;

void main()
{
	//ambient 全局光照
	float ambientStrength = 0.3;
	vec3 ambient = ambientStrength * vec3(texture(earth, TextCoords));
	
	//diffuse 漫射光照
    vec3 LightPos = vec3(view * vec4(lightPos, 1.0)); 	
	vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(LightPos - FragPosition);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * vec3(texture(earth, TextCoords));	
	
    // specular 镜面反射
    float specularStrength = 0.3;
    vec3 ViewPos = vec3(view * vec4(viewPos, 1.0)); 	
    vec3 viewDir = normalize(ViewPos - FragPosition);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = specularStrength * spec * vec3(texture(specularMap, TextCoords));  
	
	//Point light constants 点光源衰减
	float distance = length(LightPos - FragPosition);
	float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));  

	//results
	//fragmentColor = vec4(attenuation * (ambient + diffuse + specular), 1.0);

     // Results
    vec4 color = vec4(attenuation * (ambient + diffuse + specular), 1.0);
    color.a = transparency; // 设置透明度
    fragmentColor = color;

}