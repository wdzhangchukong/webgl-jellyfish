
var mWorld = new M4x4.$();
window.mWorld = mWorld;
var mViewInv = new M4x4.$();
window.mViewInv = mViewInv;
var mView = new M4x4.$();
window.mView = mView;
var mProjection = new M4x4.$();
window.mProjection = mProjection;

var mWorldView = new M4x4.$();
window.mWorldView = mWorldView;
var mWorldViewProj = new M4x4.$();
window.mWorldViewProj = mWorldViewProj;
var mTemp = new M4x4.$();

var joint0 = new M4x4.$();
window.joint0 = joint0;
var joint1 = new M4x4.$();
window.joint1 = joint1;
var joint2 = new M4x4.$();
window.joint2 = joint2;
var joint3 = new M4x4.$();
window.joint3 = joint3;
var joint0InvTranspose = new M4x4.$();
window.joint0InvTranspose = joint0InvTranspose;

window.setTimeUniform = function setTimeUniform(time){
  gl.uniform1f(currentProgram.currentTime, time);
}
window.setjTimeUniform = function setjTimeUniform(time){
  gl.uniform1f(currentProgram.currentJellyfishTime, time);
}

window.setJointUniforms = function setJointUniforms(){
  gl.uniformMatrix4fv(currentProgram.joint0, gl.FALSE, new Float32Array(joint0));
  gl.uniformMatrix4fv(currentProgram.joint1, gl.FALSE, new Float32Array(joint1));
  gl.uniformMatrix4fv(currentProgram.joint2, gl.FALSE, new Float32Array(joint2));
  gl.uniformMatrix4fv(currentProgram.joint3, gl.FALSE, new Float32Array(joint3));

  M4x4.inverseOrthonormal(joint0,joint0InvTranspose);
  M4x4.transpose(joint0InvTranspose,joint0InvTranspose);
  gl.uniformMatrix4fv(currentProgram.joint0InvTranspose, gl.FALSE, new Float32Array(joint0InvTranspose));
}

window.setMatrixUniforms = function setMatrixUniforms(){
  // Set necessary matrices
  M4x4.mul(window.mView, window.mWorld,mWorldView);
  M4x4.mul(window.mProjection,mWorldView,mWorldViewProj);
  M4x4.inverseOrthonormal(window.mView,mViewInv);

  // Set Uniforms
  gl.uniformMatrix4fv(currentProgram.world, gl.FALSE, new Float32Array(window.mWorld));
  // gl.uniformMatrix4fv(currentProgram.worldView, gl.FALSE, new Float32Array(mWorldView));
  gl.uniformMatrix4fv(currentProgram.worldViewProj, gl.FALSE, new Float32Array(mWorldViewProj));
  gl.uniformMatrix4fv(currentProgram.viewInv, gl.FALSE, new Float32Array(mViewInv));
}
