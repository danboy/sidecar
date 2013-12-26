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
, getPosition: function(obj){
   var position = obj.getBoundingClientRect();
   var parentPos = obj.parentNode.getBoundingClientRect();
   var data =  {
      top: (obj.parentNode.offsetHeight - obj.offsetTop)
    , right: position.right-parentPos.left
    , bottom: (obj.parentNode.offsetHeight - obj.offsetTop) - obj.offsetHeight
    , left: position.left-parentPos.left
    , height: obj.offsetHeight
    , width: obj.offsetWidth
    , parentTop: obj.parentNode.offsetHeight
    , parent: parentPos
   };
   return(data);
  }
, direction: function(a, b, cb){
    var direction, closest, offset = 1;
    a = this.getPosition(a);
    b = this.getPosition(b);
    var leftDist    = (b.left - b.width/2) - (a.left + a.width/2)
    , rightDist   = (a.left - a.width/2) - (b.left + b.width/2)
    , bottomDist  = (b.bottom) - (a.bottom + a.height)
    , topDist     = (a.bottom) - (b.bottom + b.height);

    var xDist = a.left - b.left;
    var yDist = b.bottom - a.bottom;
    if( leftDist  < offset &&
      rightDist   < offset &&
      topDist     < offset &&
      bottomDist  < offset ){

      if(yDist < offset) {
        closest = topDist;
        direction = 'top';
      }else{
        closest = bottomDist;
        direction = 'bottom';
      }

      if(xDist < offset) {
        if( closest < xDist ){
          closest = leftDist;
          direction = 'left';
        }
      } else {
        if( closest < xDist ){
          closest = rightDist;
          direction = 'right';
        }
      }

    };
    cb(closest, direction, b);
    return direction;
  }
}
