"use strict";

// main canvas
class Maincanvas {
  constructor() {
    this.id;
    this.canvas;
    this.width;
    this.height;
    this.gl;
    this.program;
    this.positionLocation;
    this.texcoordLocation;
    this.matrixLocation;
    this.textureLocation;
    this.positionBuffer;
    this.texcoordBuffer;
  }
  setId(canvas_id) {
    this.id = canvas_id;
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  setGL(gl) {
    this.gl = gl;
  }
  setProgram(program) {
    this.program = program;
  }
  setPositionLocation(positionLocation) {
    this.positionLocation = positionLocation;
  }
  setTexcoordLocation(texcoordLocation) {
    this.texcoordLocation = texcoordLocation;
  }
  setMatrixLocation(matrixLocation) {
    this.matrixLocation = matrixLocation;
  }
  setTextureLocation(textureLocation) {
    this.textureLocation = textureLocation;
  }
  setPositionBuffer(positionBuffer) {
    this.positionBuffer = positionBuffer;
  }
  setTexcoordBuffer(texcoordBuffer) {
    this.texcoordBuffer = texcoordBuffer;
  }
}
//gobal var mainCanvas
const mainCanvas = new Maincanvas();
// resize glcanvas
function init(canvas_id) {
  mainCanvas.setId(canvas_id);
  try {
    mainCanvas.setWidth(getBrowserWidth());
    mainCanvas.setHeight(getBrowserHeight());
  } catch (e) {
    if (e instanceof ReferenceError) {
      console.log("%c%s", 'color:red;font-weight:bold;', 'you should include tools.js before init.js');
    }
  }
  mainCanvas.setCanvas(document.getElementById(canvas_id));
  document.getElementById(canvas_id).width = mainCanvas.width;
  document.getElementById(canvas_id).height = mainCanvas.height;
}
// load mainCanvas
window.onload = init("glcanvas");