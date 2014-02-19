/**
 * @author naoki
 */

"use strict";

$(function() {
//function webGLStart() {
	var ENABLE_GL_DEBUG = true;
	//var ENABLE_GL_DEBUG = false;

	var canvas = document.getElementById("webGLCanvas");
	var gl = initWebGL(canvas, ENABLE_GL_DEBUG);
	var prgObj = initProgram(gl, "vs", "fs");

	gl.useProgram(prgObj); // Don't forget this !!!!

	var uniform = new UniformLocation();
	initMatrix(gl, prgObj, uniform);

  var INC_BODY_COUNT =    2000;
  var MAX_BODY_COUNT = 5000000;
  var bodySys = new BodySystem(MAX_BODY_COUNT, gl, prgObj);

	var angle = 0.0;
	(function drawScene() {
		(function drawMainView() {
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			//gl.enable(gl.DEPTH_TEST);
			//gl.depthFunc(gl.LEQUAL);
			gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
			//gl.clearColor(1.0, 1.0, 1.0, 1.0);
			gl.clearColor(0.0, 0.0, 0.0, 0.0);
			gl.clearDepth(1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
			var   pMatrix = mat4.frustum(-0.3, 0.3, -0.3, 0.3, 0.5, 10.0);
			var  mvMatrix = mat4.identity(mat4.create());
			var mvpMatrix = mat4.identity(mat4.create());

			angle += 0.01;
			mat4.translate(mvMatrix, [0.0, 0.0, -4.8 + Math.sin(angle * 0.5)*2.0]);
			mat4.translate(mvMatrix, [0.0, 0.2, 0.0]);
			mat4.rotateX(mvMatrix, -45.0/ 180 * Math.PI);
			mat4.rotateZ(mvMatrix, angle);
			gl.uniformMatrix4fv(uniform.getLocation("pMatrix"), false, pMatrix);
			gl.uniformMatrix4fv(uniform.getLocation("mvMatrix"), false, mvMatrix);

      bodySys.render();

		})();
		gl.flush();

    bodySys.addBody(INC_BODY_COUNT);

		printInfo(bodySys);

		var timeoutId = setTimeout(drawScene, 1.0/30 * 1000);
	} ());
	
	////////////////////
	// local function //
	////////////////////
	function initMatrix(gl, prgObj, uniform) {
		uniform.setLocation("pMatrix" , gl, prgObj);
		uniform.setLocation("mvMatrix", gl, prgObj);

		var  pMatrix = mat4.identity(mat4.create());
		var mvMatrix = mat4.identity(mat4.create());

		gl.uniformMatrix4fv(uniform.getLocation("pMatrix" ), false,  pMatrix);
		gl.uniformMatrix4fv(uniform.getLocation("mvMatrix"), false, mvMatrix);
	}
	function printInfo(bodySys) {
		var bodyCount = $.format.number(bodySys.body.count, '#,###'); //num2str(bodySys.body.count(), 5);
    var pi        = $.format.number(bodySys.pi(), '0.0000000');
		$("#info").html(
			"<p>Number of Points: " + bodyCount + "</p>" +
			"<p>PI(target): " + 3.14159 + "</p>" +
			"<p>PI: " + pi + "</p>"
		);

		////////////////////
		// local function //
		////////////////////
		function num2str(num, digit) {
			var str = new String(num);
			while ( str.length < digit ) {str = " " + str;}
			return str.replace(/ /g, "&nbsp;");
		}
	}
//}
});
