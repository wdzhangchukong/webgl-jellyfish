// JavaScript Document
var texture = {};
var textureOK = {};

window.initTextures = function initTextures() {
  loadTexture('jellyfish', 'res/images/jellyfish.png');
  loadTexture('luminescence', 'res/images/luminescence.png');

  for (var i = 1; i <= 32; i++) {
    loadTexture('caustics' + i, 'res/images/caustics/caustics7.' + pad2(i - 1) + '.jpg');
  }
}

function loadTexture(label, path) {
  textureOK[label] = 0;
  texture[label] = gl.createTexture();
  if (WX_GAME_ENV){
    texture[label].image = wx.createImage();
  }else{
    texture[label].image = new Image();
  }
  
  texture[label].image.src = path;

  texture[label].image.onload = function () {
    handleLoadedTexture(texture[label], label);
  }
  texture[label].image.onerror = function() {
    console.log("error");
  }
}

function handleLoadedTexture(textures, label) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, textures);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  textureOK[label] = 1;
}

window.bindTexture = function bindTexture(name, i) {
  if (textureOK[name] == 1) {
    if (i == 0) {
      gl.activeTexture(gl.TEXTURE0);
    }
    if (i == 1) {
      gl.activeTexture(gl.TEXTURE1);
    }
    if (i == 2) {
      gl.activeTexture(gl.TEXTURE2);
    }
    gl.bindTexture(gl.TEXTURE_2D, texture[name]);
    if (currentProgram.sampler[i] != null && currentProgram.sampler[i] !=  -1) {
      gl.uniform1i(currentProgram.sampler[i], i);
    }    
  }
}

function pad2(number) {
  return (parseInt(number) < 10 ? '0' : '') + parseInt(number)
}