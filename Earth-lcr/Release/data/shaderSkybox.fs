#version 450 core

in vec3 TextCoords;

out vec4 fragmentColor;

uniform samplerCube skybox;

void main()
{
    fragmentColor = texture(skybox, TextCoords);
}
