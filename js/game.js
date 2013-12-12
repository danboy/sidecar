/*******************
 *
 *  Highly experimental and hacky game engine.
 *  ToDO
 *
 *  1. Make Tiles act as platform on collision
 *  2. Move gameboard logic and game movement object to their own objects
 *  3. Move actual movement to physics engine
 *  4. Resolve collisions and create player "life"
 *  5. Point system
 *  6. Create parralax scroll an backgrounds.
 *
 * ********************/

var Game = function(board, options){
  this.collision = new Collision();
  this.physics = new Physics({
    jump: 10
  });
  this.options = JS.merge({
    players: ['main']
  , life: 3
  , speed: .25
  , keys: []
  , framerate: 60
  , initialJumpForce: 3
  , gravity: 10
  }, options);
  this.createWorld(board, options);
}

Game.prototype = {
  update: function(){
    this.movePlayers();
    (this.isJumping) ? this.doJump(this.player) : this.isFalling(this.player);
    if(this.isMoving){
      this.move(this.player, this.isMoving);
    }
  }
, createWorld: function(board){
    this.board = document.getElementById(board);
    JS.addClass(this.board, 'gameBoard');
    this.setGameVariables();
    this.addPlayers();
    this.addTiles();
    this.addCharacters();
    this.start()
  }
, setGameVariables: function(){
    this.life = this.options.life;
    this.tiles = [];
    this.players = [];
    this.characters = [];
  }
, isFalling: function(obj){
    this.tileCollision(obj);
    position = JS.getPosition(obj);
    parentPosition = JS.getPosition(obj.parentNode)
    var y = parentPosition.bottom-position.bottom; 
    if(y > 1){
      obj.style.bottom = this.physics.fall(parseInt(obj.style.bottom), obj)+'px';
    }else{
      obj.style.bottom = '0px';
    }
  }
, tileCollision: function(obj){
    this.tiles.forEach(function(tile){
      tile = JS.getPosition(tile);
      this.collision.detectDirection(JS.getPosition(obj), tile, function(collision, direction){
        if(collision){
          this.resolveCollision[direction](obj, collision);
        }
      }.bind(this));
    }.bind(this));
  }
, resolveCollision: [
    function(obj, distance){
      obj.style.left = (parseInt(obj.style.left)+distance)+'px';
    }
  , function(obj, distance){
      obj.style.left = (parseInt(obj.style.left)+distance)-'px';
    }
  , function(obj, distance){
      obj.style.bottom = (parseInt(obj.style.bottom)+distance)+'px';
    }
  , function(obj, distance){
      obj.style.bottom = (parseInt(obj.style.bottom)-distance)+'px';
    }
  ]
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
, addPlayers: function(){
    Players.forEach(function(player){
      player = this.addPlayer(player);
      this.players.push(player);
    }.bind(this));
  }
, addPlayer: function(attr){
    var player = this.addObject({'class': 'player'})
    this.assignKey(attr.keys.left,  function(e){this.left(player)}.bind(this));
    this.assignKey(attr.keys.left, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(attr.keys.up,  function(e){this.jump(player)}.bind(this));
    this.assignKey(attr.keys.right, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(attr.keys.right,  function(e){this.right(player)}.bind(this));
    player.style.bottom = '300px';
    this.player = player;
  }
, addTiles: function(){
    Tiles.forEach(function(tile){
      var tile = this.addTile({class: 'tile', left: parseInt(tile.position.left), bottom: tile.position.bottom});
      this.tiles.push(tile);
    }.bind(this));
  }
, addTile: function(tile){
    var obj = this.addObject(tile);
    obj.style.bottom = tile.bottom;
    return obj;
  }
, addCharacters: function(){
    Characters.forEach(function(character){
      var character = this.addObject({class: 'character', left: character.position.start});
      this.characters.push(character);
    }.bind(this));
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
, getLeftValue: function(object){
    var obj = JS.getPosition(object);
    var container = JS.getPosition(object.parentNode);
    return obj.left-container.left;
  }
, movePlayers: function(){
    this.characters.forEach(function(character){
      if(this.collision.detect(JS.getPosition(character), JS.getPosition(this.player))){  
        this.removeLife();
      }else{
        this.moveLeft(character)
      };
    }.bind(this));
  }
, removeLife: function(player){
    return (this.life > 1) ? this.life-- : this.gameOver();
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
, jump: function(){
    this.isJumping = true;
  }
, doJump: function(obj){
    obj.style.bottom = this.physics.jump(parseInt(obj.style.bottom), obj)+'px';
    
    if(obj.style.bottom == '0px'){
      this.isJumping= false;
    }
  }
, gameOver: function(object){
    this.addObject({type: 'h1', text: 'Game over', left: 300});     
  }
};
var game = new Game('window');
