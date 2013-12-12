var Physics = function(options){
  this.options = JS.merge({
    jump: 10
  , fall: -1
  , gravity: 1
  , objects: [] 
  },options);
  this.velocity = 0;
};

Physics.prototype = {
  fall: function(velocity, player){
    this.createObject(player,'fall');
    var velocity = this.doVelocity(velocity, this.options.objects[player], 'fall');
    return this.checkVelocity(velocity, function(obj){
      this.options.objects[player].jump = this.options.jump;
      return 0;
    }.bind(this));
  }
, run: function(velocity, player){
    
  }
, jump: function(velocity, player){
    this.createObject(player,'jump');
    var velocity = this.doVelocity(velocity, this.options.objects[player], 'jump');
    return this.checkVelocity(velocity, function(obj){
      this.options.objects[player].jump = this.options.jump;
      return 0;
    }.bind(this));
  }
, checkVelocity: function(velocity, action){
    return (velocity <= 0) ? action(velocity) : velocity;
  }
, doVelocity: function(velocity, obj, action){
    obj[action] -= this.options.gravity;
    velocity += obj[action] * 1.5;
    return velocity;
  }
, createObject: function(object, action, cb){
    var obj = false;
    if(this.options.objects[object] == undefined){
      obj = this.options.objects[object] = object;
      obj[action] = this.options[action]
    }
    return obj;
  }
};
