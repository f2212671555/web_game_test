"use strict";




function main() {

    initGL(mainCanvas);
    testGIF(mainCanvas);
    // var background_textureInfos = [
    //     loadImageAndCreateTextureInfo(mainCanvas, '/resourses/images/background/airadventurelevel4.png')
    // ];
    // var charactor_textureInfos = [
    //     loadImageAndCreateTextureInfo(mainCanvas, '/resourses/images/leaves.jpeg')
    // ];
    // var button_textureInfos = [
    //     loadImageAndCreateTextureInfo(mainCanvas, '/resourses/images/button/play.png')
    // ];
    // window.onload = function () {

    //     var drawInfos = {
    //         "chartactor": [],
    //         "background": [],
    //         "play": []
    //     };
    //     drawInfos.chartactor.push(createDrawInfoWith(mainCanvas, charactor_textureInfos[0]));
    //     drawInfos.background.push(create_Card_Background(mainCanvas, background_textureInfos[0]));
    //     drawInfos.play.push(create_Card_Play(mainCanvas, button_textureInfos[0]));
    //     var then = 0;

    //     function render(time) {
    //         var now = time * 0.001;
    //         var deltaTime = Math.min(0.1, now - then);
    //         then = now;
    //         input(drawInfos[1]);
    //         update(mainCanvas, drawInfos, 60, deltaTime);
    //         draw(mainCanvas, drawInfos);

    //         requestAnimationFrame(render);
    //     }
    //     requestAnimationFrame(render);

    // }
}

function input(drawInfo) {
    jQuery(function ($) {
        var currentMousePos = {
            x: -1,
            y: -1
        };
        $(document).mousedown(function (event) {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY;
            // console.log("X :: " + currentMousePos.x);
            // console.log("Y :: " + currentMousePos.y);
            drawInfo.contains(currentMousePos.x, currentMousePos.y);
        });

        // ELSEWHERE, your code that needs to know the mouse position without an event
        if (currentMousePos.x < 10) {

        }
    });
}

function initGL(canvas) {

    var gl = canvas.canvas.getContext("webgl");
    if (!gl) {
        throw new Error('can mnot get gl');
    }
    mainCanvas.setGL(gl);

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);
    mainCanvas.setProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    mainCanvas.setPositionLocation(positionLocation);
    mainCanvas.setTexcoordLocation(texcoordLocation);
    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var textureLocation = gl.getUniformLocation(program, "u_texture");
    mainCanvas.setMatrixLocation(matrixLocation);
    mainCanvas.setTextureLocation(textureLocation);
    // Create a buffer.
    var positionBuffer = gl.createBuffer();
    mainCanvas.setPositionBuffer(positionBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    var positions = [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coords
    var texcoordBuffer = gl.createBuffer();
    mainCanvas.setTexcoordBuffer(texcoordBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Put texcoords in the buffer
    var texcoords = [
        0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
}

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(canvas, url) {
    var gl = canvas.gl;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    // let's assume all images are not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    var textureInfo = new TextureInfo(); // init
    textureInfo.setWidth(1);
    textureInfo.setHeight(1);
    textureInfo.setTexture(tex);

    var img = new Image();

    img.addEventListener('load', function () {
        textureInfo.setWidth(img.width);
        textureInfo.setHeight(img.height);

        gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        // console.log(textureInfo)
    });
    img.src = url;

    return textureInfo;
}

function createDrawInfoWith(canvas, textureInfo) {
    var gl = canvas.gl;

    var width_tmp = 1;
    var height_tmp = 1;

    var drawInfo = new DrawInfo();
    drawInfo.setXScale(width_tmp * 0.25 + 0.25);
    drawInfo.setYScale(height_tmp * 0.25 + 0.25);
    drawInfo.setTextureInfo(textureInfo);
    drawInfo.setX(3);
    drawInfo.setY(3);
    drawInfo.setDrawWidth(drawInfo.textureInfo.width * drawInfo.xScale);
    drawInfo.setDrawHeight(drawInfo.textureInfo.height * drawInfo.yScale);

    return drawInfo;
}

function create_Card_Play(canvas, textureInfo) {
    var gl = canvas.gl;

    var width_tmp = 1;
    var height_tmp = 1;

    var card = new Card();
    card.setXScale(width_tmp * 0.25 + 0.25);
    card.setYScale(height_tmp * 0.25 + 0.25);
    card.setTextureInfo(textureInfo);
    card.setDrawWidth(card.textureInfo.width * card.xScale);
    card.setDrawHeight(card.textureInfo.height * card.yScale);
    card.setX((gl.canvas.width - card.drawWidth) / 2);
    card.setY((gl.canvas.height - card.drawHeight) / 2);
    return card;
}

function create_Card_Background(canvas, textureInfo) {
    var gl = canvas.gl;

    var width_tmp = 1;
    var height_tmp = 1;

    var card = new Card();
    card.setXScale(width_tmp * 0.25 + 0.25);
    card.setYScale(height_tmp * 0.25 + 0.25);
    card.setTextureInfo(textureInfo);
    card.setDrawWidth(gl.canvas.width);
    card.setDrawHeight(gl.canvas.height);
    card.setX(0);
    card.setY(0);
    return card;
}

function update(canvas, drawInfos, speed, deltaTime) {
    var gl = canvas.gl;

    drawInfos.background.forEach(function (drawInfo) {
        drawInfo.x += drawInfo.dx * speed * deltaTime;

    });
    rolling_background(canvas, drawInfos, speed, deltaTime);
}

function rolling_background(canvas, drawInfos, speed, deltaTime) {
    var gl = canvas.gl;
    drawInfos.background.forEach(function (drawInfo) {
        drawInfo.x += drawInfo.dx * speed * deltaTime;
        if (drawInfo.x <= 0) {
            drawInfo.dx = 1;
        } else {
            drawInfo.dx = -1;
        }
    });
}

// function hitAnimate(canvas, drawInfos, speed, deltaTime) {
//     var gl = canvas.gl;
//     drawInfos.forEach(function (drawInfo) {
//         drawInfo.x += drawInfo.dx * speed * deltaTime;
//         drawInfo.y += drawInfo.dy * speed * deltaTime;
//         if (drawInfo.x < 0) {
//             drawInfo.dx = 1;
//         }
//         if (drawInfo.x + drawInfo.textureInfo.width * drawInfo.xScale >= gl.canvas.width) {
//             drawInfo.dx = -1;
//         }
//         if (drawInfo.y < 0) {
//             drawInfo.dy = 1;
//         }
//         if (drawInfo.y + drawInfo.textureInfo.height * drawInfo.yScale >= gl.canvas.height) {
//             drawInfo.dy = -1;
//         }
//     });
// }

function draw(canvas, drawInfos) {
    var gl = canvas.gl;
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    draw_(canvas, drawInfos, "background");
    draw_(canvas, drawInfos, "chartactor");
    draw_(canvas, drawInfos, "play");

}

function draw_(canvas, drawInfos, param) {

    drawInfos[param].forEach(function (drawInfo) {
        var dstX = drawInfo.x;
        var dstY = drawInfo.y;
        // var dstWidth = drawInfo.textureInfo.width * drawInfo.xScale;
        // var dstHeight = drawInfo.textureInfo.height * drawInfo.yScale;
        var dstWidth = drawInfo.drawWidth;
        var dstHeight = drawInfo.drawHeight;

        drawImage(
            canvas, drawInfo.textureInfo.texture,
            drawInfo.textureInfo.width,
            drawInfo.textureInfo.height,
            dstX, dstY, dstWidth, dstHeight);
    })
}

// Unlike images, textures do not have a width and height associated
// with them so we'll pass in the width and height of the texture
function drawImage(
    canvas, tex, texWidth, texHeight,
    dstX, dstY, dstWidth, dstHeight) {
    var gl = canvas.gl;
    var program = canvas.program;

    var positionLocation = canvas.positionLocation
    var texcoordLocation = canvas.texcoordLocation

    var matrixLocation = canvas.matrixLocation
    var textureLocation = canvas.textureLocation

    var positionBuffer = canvas.positionBuffer;
    var texcoordBuffer = canvas.texcoordBuffer;

    if (dstWidth === undefined) {
        dstWidth = texWidth;
    }

    if (dstHeight === undefined) {
        dstHeight = texHeight;
    }

    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Tell WebGL to use our shader program pair
    gl.useProgram(program);

    // Setup the attributes to pull data from our buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = m4.translate(matrix, dstX, dstY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

main();

function testGIF(canvas) {
    const m4 = twgl.m4;
const gl = document.querySelector("glcanvas").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 2);

let img;
let ctx;
const tex = twgl.createTexture(gl, {
  minMag: gl.NEAREST,
  wrap: gl.CLAMP_TO_EDGE,  
  src: "https://i.imgur.com/HuToBIl.gif",
  crossOrigin: "anonymous",
}, (err, tex, src) => { 
  img = src;
  ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;
  document.body.appendChild(img);
});

function render(time) {
  time *= 0.001;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  
  if (img) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
  }

  const fov = 45 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = m4.perspective(fov, aspect, 0.5, 100);
  const eye = [0, 1, -4];
  const target = [0, 0, 0];
  const up = [0, 1, 0];

  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);

  let mat = m4.rotateY(viewProjection, time);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, {
    u_texture: tex,
    u_worldViewProjection: mat,
  });
  twgl.drawBufferInfo(gl, bufferInfo);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
}
