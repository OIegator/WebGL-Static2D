#version 300 es

in vec3 aVertexPosition;
in vec4 aVertexColor;
uniform mat4 mvMatrix;
uniform mat4 prMatrix;
out vec4 color;

void main() {
    gl_Position = prMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
    color = aVertexColor;
}
