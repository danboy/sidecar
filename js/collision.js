var Collision = function(){

}

Collision.prototype = {
  detect: function(a,b){
    return !(
      ((a.bottom + a.height) < (b.bottom)) ||
      (a.bottom > (b.bottom + b.height)) ||
      ((a.left + a.width) < b.left) ||
      (a.left > (b.left + b.width))
    );
  }
, detectDirection: function(a, b, cb){
    var direction, closest, offset = 0;

    leftDist    = (b.left - b.width/2) - (a.left + a.width/2);
    rightDist   = (a.left - a.width/2) - (b.left + b.width/2);
    topDist     = (b.bottom - b.height/2) - (a.bottom + a.height/2);
    bottomDist  = (a.bottom - a.height/2) - (b.bottom + b.height/2);

    if( leftDist    < offset &&
        rightDist   < offset &&
        topDist     < offset &&
        bottomDist  < offset ){
        var xDist = a.left - b.left;
        var yDist = a.bottom - b.bottom;

        if(xDist < offset) {
          closest = leftDist;
          direction = 0;
        } else {
          closest = rightDist;
          direction = 1;
        }

        if(closest < yDist) {
          if(yDist < offset) {
            closest = topDist;
            direction = 2;
          }else{
            closest = bottomDist;
            direction = 3;
          }
        };
    };
    cb(closest, direction);
  }
}
