var Collision = function(){

}

Collision.prototype = {
  detect: function(a, b){
    return !(
      ((a.top + a.height) < (b.top)) ||
      (a.top > (b.top + b.height)) ||
      ((a.left + a.width) < b.left) ||
      (a.left > (b.left + b.width))
    );
  }

}
