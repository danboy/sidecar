var Physics = function(options){
  this.collision = new Collision();
  this.options = JS.merge({
    jump: 10
  , fall: -1
  , gravity: 1
  , objects: [] 
  },options);
  this.velocity = 0;
};

Physics.prototype = {
  fall: function(obj, baseline){
    this.createObject(obj,'fall');
    return this.checkVelocity(obj, baseline, 'fall', function(obj, baseline){
      this.options.objects[obj].fall = this.options.fall;
      return baseline;
    }.bind(this));
  }
, move: function(obj, velocity){
    obj.style.left = (parseInt(obj.style.left) +  velocity) + 'px';
  }
, jump: function(obj, baseline){
    this.createObject(obj,'jump');
    return this.checkVelocity(obj, baseline, 'jump', function(obj, baseline){
      this.options.objects[obj].jump = this.options.jump;
      return baseline;
    }.bind(this));
  }
, resetJump: function(obj){
    this.createObject(obj,'jump');
    this.options.objects[obj].jump = this.options.jump; 
  }
, checkVelocity: function(obj, baseline, type, action){
    var velocity = this.doVelocity(parseInt(obj.style.bottom), this.options.objects[obj], type);
    return (velocity <= baseline) ? action(obj, baseline) : velocity;
  }
, doVelocity: function(velocity, obj, action){
    obj[action] -= this.options.gravity;
    velocity += obj[action] * 1.5;
    return velocity;
  }
, createObject: function(object, action, cb){
    var obj = this.options.objects[object];
    if(obj == undefined){
      obj = this.options.objects[object] = object;
    }
    if(obj[action] == undefined){
      obj[action] = this.options[action];
    }
    return obj;
  }
};
