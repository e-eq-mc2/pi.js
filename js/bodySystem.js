var BodySystem = function(maxBodyCount, gl, prgObj) {
  this.insideCount = 0;
  this.body = new Body(maxBodyCount);
  this.attrib = new Attrib(gl, prgObj);
  this.attrib.setBuffer ("vertexPosition", gl.ARRAY_BUFFER, this.body.vertices);

  this.addBody = function (addCount) {
    if ( this.body.count + addCount > this.body.maxCount ) return;

    //this.insideCount += this.body.add(addCount);
    //this.attrib.replaceData("vertexPosition", this.body.vertices);
    
    var bgn = this.body.count * 3;
    this.insideCount += this.body.add(addCount);
    var end = this.body.count * 3;
    this.attrib.subData("vertexPosition", bgn * 4, this.body.vertices.subarray(bgn, end));
  }
  this.render = function() {
	  var gl = this.attrib.gl;
	  this.attrib.linkBuffer("vertexPosition", 3, gl.FLOAT);
	  gl.drawArrays(gl.POINTS, 0, this.body.count);
  };
  this.pi = function() {
    return this.insideCount / this.body.count * 3/4 * 8;
  }

  /////////////////////
  // local function //
  /////////////////////
  function Body(maxCount) {
    this.count = 0;
    this.maxCount = maxCount;
    this.vertices = new Float32Array(maxCount * 3);
    this.rand_mt  = new MersenneTwister(123);

    this.add = function (addCount) {
      var bgn = this.count;
      var end = bgn + addCount;
      var insideCount = 0;
      for(var i = bgn; i < end; ++i) {
        //var x = Math.random() * 2 - 1;
        //var y = Math.random() * 2 - 1;
        //var z = Math.random() * 2 - 1;
        var x = this.rand_mt.next() * 2 - 1;
        var y = this.rand_mt.next() * 2 - 1;
        var z = this.rand_mt.next() * 2 - 1;

        var r = Math.sqrt(x*x + y*y + z*z);
        this.vertices[i * 3 + 0] = x;
        this.vertices[i * 3 + 1] = y;
        this.vertices[i * 3 + 2] = z;
        if ( r <= 1.0 ) ++insideCount;
      }
      this.count += addCount;
      return insideCount;
    }
  }
}; // end of bodySystem
