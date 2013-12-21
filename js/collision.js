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
    var leftDist    = (b.left - b.width/2) - (a.left + a.width/2);
    var rightDist   = (a.left - a.width/2) - (b.left + b.width/2);
    var bottomDist     = (b.bottom - b.height/2) - (a.bottom + a.height/2);
    var topDist  = (a.bottom - a.height/2) - (b.bottom + b.height/2);

    var xDist = a.left - b.left;
    if( leftDist  < offset &&
      rightDist   < offset &&
      topDist     < offset &&
      bottomDist  < offset ){

      var yDist = a.bottom - b.bottom;
      if(xDist < offset) {
        closest = leftDist;
        direction = 'left';
      } else {
        closest = rightDist;
        direction = 'right';
      }

      if(yDist < offset) {
        if( closest < yDist ){
          closest = topDist;
          direction = 'top';
        }
      }else{
        if( closest < yDist ){
          closest = bottomDist;
          direction = 'bottom';
        }
      }
    };
    cb(closest, direction, b);
    return direction;
  }
}
