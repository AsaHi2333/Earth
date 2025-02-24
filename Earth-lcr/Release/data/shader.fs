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

//For point light点光源
uniform float constant;
uniform float linear;
uniform float quadratic;

void main()
{
	//ambient环境光计算
	float ambientStrength = 0.3;
	vec3 ambient = ambientStrength * vec3(texture(earth, TextCoords));
	
	//diffuse漫反射计算
    vec3 LightPos = vec3(view * vec4(lightPos, 1.0));//光源位置从世界空间转换到眼睛空间
	vec3 norm = normalize(Normal);//规范法线向量
    vec3 lightDir = normalize(LightPos - FragPosition);//计算光源方向
    float diff = max(dot(norm, lightDir), 0.0);//计算漫反射强度
    vec3 diffuse = diff * vec3(texture(earth, TextCoords));	//漫反射的颜色
	
    // specular镜面反射
    float specularStrength = 0.3;//镜面反射强度
    vec3 ViewPos = vec3(view * vec4(viewPos, 1.0)); 	//将观察者位置从世界空间转换到眼睛空间
    vec3 viewDir = normalize(ViewPos - FragPosition);//计算观察方向
    vec3 reflectDir = reflect(-lightDir, norm); //反射向量
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);//计算镜面反射强度
    vec3 specular = specularStrength * spec * vec3(texture(specularMap, TextCoords));  //镜面反射颜色
	
	//Point light constants点光源衰减
	float distance = length(LightPos - FragPosition);//计算片段到光源的距离
	float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));//计算衰减因子

	//results 计算光照的结果
	fragmentColor = vec4(attenuation * (ambient + diffuse + specular), 1.0);
}