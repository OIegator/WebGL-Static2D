#version 300 es
#ifdef GL_ES
precision highp float;
#endif

in vec4 color;
in vec3 vPosition;
out vec4 fragColor;

void main(void) {
    float k = 8.0;
    int x = int(vPosition.x * k);
    if ( (x - (x / 2 * 2)) == 0 ) {
        fragColor = vec4(0.0, 1.0, 1.0, 1);
    }
    else {
        fragColor = vec4(1.0, 1.0, 1.0, 1);
    }
}
