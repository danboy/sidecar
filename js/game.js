var Characters = [
  {name: 'test', position: {start: 200}}
, {name: 'boingo', position: {start: 800}}
];

var Game = function(board, options){
  this.collision = new Collision();
  this.physics = new Physics();
  this.options = JS.merge({
    players: ['main']
  , speed: .25
  , keys: []
  , framerate: 60
  , initialJumpForce: 3
  , gravity: 10
  }, options)
  this.characters = [];
  this.createWorld(board, options);
}

Game.prototype = {
  update: function(){
    this.movePlayers();
    this.isFalling(this.player);
    if(this.isJumping){
      this.doJump(this.player);
    }
    if(this.isMoving){
      this.move(this.player, this.isMoving);
    }
  }
, start: function(){
    var drawFrame = this.getAnimateFrame();
    var self = this;
    var start = function(){
      this.update();
      drawFrame(start, this.board);
    }.bind(this);
    drawFrame( start, this.board );
  }
, getAnimateFrame: function(){
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;
  }
, stop: function(){
    clearInterval(this._timer);
    this._timer = false;
  }
, addPlayer: function(id){
    var player = this.addObject({'class': 'player'})
    this.assignKey(106, this.doJump);
    this.assignKey(37,  function(e){this.left(player)}.bind(this));
    this.assignKey(37, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(38,  function(e){this.jump(player)}.bind(this));
    this.assignKey(39, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(39,  function(e){this.right(player)}.bind(this));
    this.assignKey(40,  function(e){this.down(player)}.bind(this));
    this.player = player;
  }
, isFalling: function(character){
    position = this.getPosition(character);
    parentPosition = this.getPosition(character.parentNode)
    var y = parentPosition.bottom-position.bottom; 
    if(y > 1){
      this.down(character);
    }else{
      character.style.bottom = '0px';
    }

  }
, addObject: function(options){
    var obj = JS.create(options);
    this.board.appendChild(obj);
    if(options.left){
      var left = options.left+'px';
    }
    if(options.text){obj.innerHTML = options.text;};
    obj.style.left = left || this.getLeftValue(obj)+'px';
    return obj;
  }
, createWorld: function(board){
    this.board = document.getElementById(board);
    this.board.className = this.board.className+' gameBoard';
    this.options.players.forEach(function(){
      this.addPlayer(this);
    }.bind(this));
    this.addCharacters();
    this.start()
  }
, addCharacters: function(){
    Characters.forEach(function(character){
      var character = this.addObject({class: 'character', left: character.position.start});
      this.characters.push(character);
    }.bind(this));
  }
, assignKey: function(keyCode, event, cb){
    if(typeof(event) == 'function'){
      cb = event;
      event = 'keydown';
    }
    this.options.keys[keyCode] = function(e){
      if(e.keyCode == keyCode){
        cb(e);
      }
    };
    window.addEventListener(event, this.options.keys[keyCode]);
  }
, move: function(object, speed){
    object.style.left = this.increment(object.style.left, speed);
  }
, moveRight: function(object){
    object.style.left = this.increment(object.style.left, this.options.speed);
  }
, moveLeft: function(object){
    if(parseInt(object.style.left.replace('px','')) > 0){
      object.style.left = this.increment(object.style.left, -this.options.speed);
    }
  }
, moveVertical: function(object, speed){
    object.style.bottom = this.increment(object.style.bottom, speed);
  }
, increment: function(position, velocity){
    var position = position || "1";
    var num = position.replace('px','');
    return (parseInt(num)+velocity)+'px';
  }
, getPosition: function(obj){
   var position = obj.getBoundingClientRect();
   return {top: position.top, right: position.right, bottom: position.bottom, left: position.left, height: obj.offsetHeight, width: obj.offsetWidth} 
  }
, getLeftValue: function(object){
    var obj = this.getPosition(object);
    var container = this.getPosition(object.parentNode);
    return obj.left-container.left;
  }
, movePlayers: function(){
    this.characters.forEach(function(character){
      if(this.collision.detect(this.getPosition(character), this.getPosition(this.player))){
        this.stop();
        this.destroyPlayer(this.player);
      }else{
        this.moveLeft(character)
      };
    }.bind(this));
  }
, right: function(){
    this.isMoving = 4;
    JS.addClass(this.player, 'moving');
  }
, left: function(){
    this.isMoving = -4;
    JS.addClass(this.player, 'moving');
  }
, stopMoving: function(){
    this.isMoving = false;
    JS.removeClass(this.player, 'moving');
  }
, up: function(player){
    this.moveVertical(player, 5)
  }
, down: function(player){
    this.moveVertical(player, -5)
  }
, jump: function(){
    this.isJumping = true;
  }
, doJump: function(obj){
    obj.style.bottom = this.physics.jump(parseInt(obj.style.bottom), obj)+'px';
    if(obj.style.bottom == '0px'){
      this.isJumping= false;
    }
  }
, destroyPlayer: function(object){
    //window.removeEventListener('keydown', this.options.keys[37]);
    //window.removeEventListener('keydown', this.options.keys[39]);
    this.addObject({type: 'h1', text: 'Game over', left: 300});     
  }
};
var game = new Game('window');
