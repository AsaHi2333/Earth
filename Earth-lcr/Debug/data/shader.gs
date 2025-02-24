#version 450 core

layout (triangles) in;
layout (triangle_strip, max_vertices = 3) out;

in vec2 textCoords[];
in vec3 fragPosition[];
in vec3 normal[];

out vec2 TextCoords;
out vec3 FragPosition;
out vec3 Normal;

uniform sampler2D earth_height;
uniform mat4 projection;
uniform mat4 view;

vec4 elevate(vec3 position, float color) { 
	float magnitude = 0.035;
    return projection * view * vec4(position * (1.0 + color * magnitude), 1.0);	
}

void main()
{
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
	else if(textCoords[1].x == 0 && textCoords[0].x > 0.9f && textCoords[2].x > 0.9f){
		gl_Position = elevate(gl_in[0].gl_Position.xyz, texture(earth_height, textCoords[0]).r);
		TextCoords = textCoords[0];
		FragPosition = fragPosition[0];
		Normal = normal[0];
		EmitVertex();
		
		gl_Position = elevate(gl_in[1].gl_Position.xyz, texture(earth_height, textCoords[1]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[1].y;
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
	else if(textCoords[2].x == 0 && textCoords[0].x > 0.9f && textCoords[1].x > 0.9f){
		gl_Position = elevate(gl_in[0].gl_Position.xyz, texture(earth_height, textCoords[0]).r);
		TextCoords = textCoords[0];
		FragPosition = fragPosition[0];
		Normal = normal[0];
		EmitVertex();
		
		gl_Position = elevate(gl_in[1].gl_Position.xyz, texture(earth_height, textCoords[1]).r);
		TextCoords = textCoords[1];
		FragPosition = fragPosition[1];
		Normal = normal[1];
		EmitVertex();
		
		gl_Position = elevate(gl_in[2].gl_Position.xyz, texture(earth_height, textCoords[2]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[2].y;
		FragPosition = fragPosition[2];
		Normal = normal[2];
		EmitVertex();
		
		EndPrimitive();
	}
	else if(textCoords[0].x == 0 && textCoords[1].x == 0 && textCoords[2].x > 0.9f){
		gl_Position = elevate(gl_in[0].gl_Position.xyz, texture(earth_height, textCoords[0]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[0].y;
		FragPosition = fragPosition[0];
		Normal = normal[0];
		EmitVertex();
		
		gl_Position = elevate(gl_in[1].gl_Position.xyz, texture(earth_height, textCoords[1]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[1].y;
		FragPosition = fragPosition[1];
		Normal = normal[1];
		EmitVertex();
		
		gl_Position = gl_in[2].gl_Position;
		gl_Position = elevate(gl_in[2].gl_Position.xyz, texture(earth_height, textCoords[2]).r);		
		FragPosition = fragPosition[2];
		Normal = normal[2];
		EmitVertex();
		
		EndPrimitive();
	}
	else if(textCoords[0].x == 0 && textCoords[2].x == 0 && textCoords[1].x > 0.9f){
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
		TextCoords.x = 1;
		TextCoords.y = textCoords[2].y;
		FragPosition = fragPosition[2];
		Normal = normal[2];
		EmitVertex();
		
		EndPrimitive();
	}
	else if(textCoords[1].x == 0 && textCoords[2].x == 0 && textCoords[0].x > 0.9f){
		gl_Position = elevate(gl_in[0].gl_Position.xyz, texture(earth_height, textCoords[0]).r);
		TextCoords = textCoords[0];
		FragPosition = fragPosition[0];
		Normal = normal[0];
		EmitVertex();
		
		gl_Position = elevate(gl_in[1].gl_Position.xyz, texture(earth_height, textCoords[1]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[1].y;
		FragPosition = fragPosition[1];
		Normal = normal[1];
		EmitVertex();
		
		gl_Position = elevate(gl_in[2].gl_Position.xyz, texture(earth_height, textCoords[2]).r);
		TextCoords.x = 1;
		TextCoords.y = textCoords[2].y;
		FragPosition = fragPosition[2];
		Normal = normal[2];
		EmitVertex();
		
		EndPrimitive();
	}
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