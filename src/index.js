import squareVS from '../shaders/squareVS.glsl'
import squareFS from '../shaders/squareFS.glsl'
import rectangleVS from '../shaders/triangleVS.glsl'
import rectangleFS from '../shaders/triangleFS.glsl'
import * as glm from "gl-matrix";

const canvas = document.querySelector('canvas');
let gl;

function initWebGL(canvas) {
    gl = null
    const names = ["webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (let ii = 0; ii < names.length; ++ii) {
        try {
            gl = canvas.getContext(names[ii]);
        } catch(e) {}
        if (gl) {
            break;
        }
    }

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }
    return gl;
}

function main() {
    gl = initWebGL(canvas);

    if (gl) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    if (false) {
        const shaderProgram = initShaderProgram(gl, squareVS, squareFS);

        gl.useProgram(shaderProgram);
        drawSquare(shaderProgram);
    } else {

        const shaderProgram = initShaderProgram(gl, rectangleVS, rectangleFS);

        gl.useProgram(shaderProgram);
        drawTriangle(shaderProgram);
    }
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;

}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function drawSquare(shaderProgram) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearDepth(1.0);

    const vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    const squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const prMatrix = gl.getUniformLocation(shaderProgram, "prMatrix");
    const mvMatrix = gl.getUniformLocation(shaderProgram, "mvMatrix");
    const fColor = gl.getUniformLocation(shaderProgram, "fColor");

    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionAttribute);

    const fieldOfView = (45 * Math.PI) / 180;// in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glm.mat4.create();

    glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = glm.mat4.create();
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    gl.uniform4f(fColor, 0., 1., 1., 1.)
    gl.uniformMatrix4fv(prMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(mvMatrix, false, modelViewMatrix)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawTriangle(shaderProgram) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL)

    const vertices = [
        -1.0, -1.0, 0.0,
        0.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
    ];

    const colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
    ];

    const triangleVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    const triangleColorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    const prMatrix = gl.getUniformLocation(shaderProgram, "prMatrix");
    const mvMatrix = gl.getUniformLocation(shaderProgram, "mvMatrix");
    const fieldOfView = (45 * Math.PI) / 180;// in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = glm.mat4.create();

    glm.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = glm.mat4.create();
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    gl.uniformMatrix4fv(prMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(mvMatrix, false, modelViewMatrix)
    gl.drawArrays(gl.TRIANGLES, 0, 4);
}


main();