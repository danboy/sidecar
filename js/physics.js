var Physics = function(options){
  this.options = JS.merge({
    jump: 17
  , fall: -1
  , gravity: 1
  , objects: [] 
  },options);
  this.velocity = 0;
};

Physics.prototype = {
  fall: function(height){
    
  }
, run: function(velocity, player){
    
  }
, jump: function(velocity, player){
    
    this.createObject(player,function(obj){
      obj.jump = this.options.jump;
    }.bind(this));

    var velocity = this.doVelocity(velocity, this.options.objects[player]);

    return this.checkVelocity(velocity, function(obj){
      this.options.objects[player].jump = this.options.jump;
      return 0;
    }.bind(this));

  }
, checkVelocity: function(velocity, action){
    return (velocity <= 0) ? action(velocity) : velocity;
  }
, doVelocity: function(velocity, obj){
    obj.jump -= this.options.gravity;
    velocity += obj.jump * 1.5;

    return velocity;
  }
, createObject: function(object, cb){
    var obj = false;
    if(this.options.objects[object] == undefined){
      obj = this.options.objects[object] = object;
      cb(obj);
    }
    return obj;
  }
};
