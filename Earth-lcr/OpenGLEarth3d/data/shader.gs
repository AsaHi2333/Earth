#version 450 core

// 定义输入的图元类型为三角形，输出的图元类型为三角形带
layout (triangles) in;
layout (triangle_strip, max_vertices = 3) out;

// 从顶点着色器接收的插值输出
in vec2 textCoords[];
in vec3 fragPosition[];
in vec3 normal[];

// 几何着色器的输出，将被传递到片段着色器
out vec2 TextCoords;
out vec3 FragPosition;
out vec3 Normal;

// 高度图纹理和变换矩阵
uniform sampler2D earth_height;
uniform mat4 projection;
uniform mat4 view;

// 根据高度图提升顶点位置的函数
vec4 elevate(vec3 position, float color) { 
    float magnitude = 0.035;
    return projection * view * vec4(position * (1.0 + color * magnitude), 1.0);	
}

void main()
{
    // 根据不同的纹理坐标条件，处理三角形的每个顶点
    if(textCoords[0].x == 0 && textCoords[1].x > 0.9f && textCoords[2].x > 0.9f){
        gl_Position = elevate(gl_in[0].gl_Position.xyz, texture(earth_height, textCoords[0]).r);
        TextCoords.x = 1;
        TextCoords.y = textCoords[0].y;
        FragPosition = fragPosition[0];
        Normal = normal[0];
        EmitVertex();
        
        gl_Position = elevate(gl_in[1].gl_Position.xyz, texture(earth_height, textCoords[1]).r);
        TextCoords = textCoords[1];
        FragPosition = fragPosition[1];
        Normal = normal[1];
        EmitVertex();
        
        gl_Position = elevate(gl_in[2].gl_Position.xyz, texture(earth_height, textCoords[2]).r);
        TextCoords = textCoords[2];
        FragPosition = fragPosition[2];
        Normal = normal[2];
        EmitVertex();        
        
        EndPrimitive();
    }
    // 其他条件的处理类似，根据不同的纹理坐标边界条件，调整顶点位置和纹理坐标
    // ...
    else{
        int i;
        for(i = 0; i < gl_in.length(); i++)
        {            
            gl_Position = elevate(gl_in[i].gl_Position.xyz, texture(earth_height, textCoords[i]).r);
            TextCoords = textCoords[i];
            FragPosition = fragPosition[i];
            Normal = normal[i];

            EmitVertex();
        }
        EndPrimitive();    
    }
}