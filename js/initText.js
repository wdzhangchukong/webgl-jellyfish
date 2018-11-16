
//lbq
var context;
var showtexcanvas;
//顶点着色器源码
var vertexShader_source = "attribute vec4 a_Position;\n" +
    "attribute vec2 a_TextureCoord;\n" +
    "varying vec2 v_TextureCoord;\n" +
    "void main()\n" +
    "{\n" +
    "   gl_Position = a_Position;\n" +
    "   v_TextureCoord = a_TextureCoord;\n" +
    "}\n";

//片元着色器源码
var fragmentShader_source = "precision lowp float;\n" +
    "uniform sampler2D u_Sampler;\n" +
    "varying vec2 v_TextureCoord;\n" +
    "void main() {\n" +
    "   gl_FragColor = texture2D(u_Sampler, v_TextureCoord);\n" +
    "}\n";

function loadShader(gl, shaderType, shaderSource) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    //返回是否链接成功
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.log("shader not compiled!");
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}

var position_location,texturecoord_location;
function createShaderProgram(gl, vertexShader, fragmentShader) {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    var compiled = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!compiled) {
        console.log("program not compiled");
        console.log(gl.getProgramInfoLog(shaderProgram));
        return;
    }
    position_location = gl.getAttribLocation(shaderProgram, "a_Position");
    texturecoord_location = gl.getAttribLocation(shaderProgram, "a_TextureCoord");
    return shaderProgram;
}

var vertexShader, fragmentShader, shaderProgramcanvas, vertexBuffer, indexBuffer, canvastexture;
var texture;
window.initTexCanvas = function initTexCanvas() {
  if (WX_GAME_ENV) {
    showtexcanvas = wx.createCanvas();
    showtexcanvas.width = innerWidth;
    showtexcanvas.height = innerHeight;
  }else {
    showtexcanvas = canvas;
  }
  context = showtexcanvas.getContext('2d');

    vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShader_source);
    fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader_source);
    shaderProgramcanvas = createShaderProgram(gl, vertexShader, fragmentShader);
    
    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer();
    canvastexture = gl.createTexture();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    setTextureCanvas();
}

function setTextureCanvas() {
    //texture
    // canvastexture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, canvastexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //  this.console.log("xxxxxx " + window.__canvas._alignment);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, showtexcanvas);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

//顶点数组
var vertices = new Float32Array([
    //0
    -1.0, 1.0,
    0, 0,
    1,
    //1
    1.0, 1.0,
    1, 0,
    1.0,
    //2
    1.0, -1.0,
    1, 1,
    1,
    //3
    -1.0, -1.0,
    0, 1,
    1,
]);
//索引数组
var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
var oldNum = -1;
 window.setTexCanvas = function setTexCanvas(num) {
     if (oldNum != num) {
         oldNum = num;
         context.clearRect(0, 0, showtexcanvas.width, showtexcanvas.height);
         context.fillStyle = "rgb(255,255,255)";
         context.font = "200px Arial";
         var text = num + "";
         context.fillText(text, showtexcanvas.width * 0.5, showtexcanvas.height * 0.5);
         setTextureCanvas();
     }
 }

 window.renderTexCanvas = function renderTexCanvas() {
    gl.useProgram(shaderProgramcanvas); 

    var u_Sampler = gl.getUniformLocation(shaderProgramcanvas, "u_Sampler");
     gl.disable(gl.DEPTH_TEST);
     
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
     gl.vertexAttribPointer(position_location, 2, gl.FLOAT, false, 5 * 4, 0);
     gl.enableVertexAttribArray(position_location);

     gl.vertexAttribPointer(texturecoord_location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
     gl.enableVertexAttribArray(texturecoord_location);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, canvastexture);
    gl.uniform1i(u_Sampler, 0);
    //  gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //  gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
     gl.disableVertexAttribArray(position_location);
     gl.disableVertexAttribArray(texturecoord_location);

    setShader("jellyfish");
     gl.enable(gl.DEPTH_TEST);
}