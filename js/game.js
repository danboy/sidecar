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
  this.physics = new Physics({
    jump: 12
  });
  this.options = JS.merge({
    life: 3
  , baseline: -200
  , keys: []
  }, options);
  this.createWorld(board, options);
}

Game.prototype = {
  update: function(){
    this.players.forEach(function(obj){
      this.physics.move(obj, this.isMoving);
      (this.isJumping) ? this.doJump(obj) : this.isFalling(obj);
      this.isDead(obj);
    }.bind(this));
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
    this.isColliding(obj, function(obj, baseline){
      obj.style.bottom = this.physics.fall(obj, baseline)+'px';
    }.bind(this));
  }
, isColliding: function(obj, cb){
    obj.baseline = this.options.baseline;
    this.tiles.forEach(function(tile, index){
      this.physics.collision.direction(obj,tile, function(distance, direction, tile){
        this.resolveCollision(direction, obj, tile);
      }.bind(this))
      if(index == (this.tiles.length-1)){
        cb(obj, obj.baseline);
      }
    }.bind(this));
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
, addPlayers: function(){
    Players.forEach(function(player){
      player = this.addPlayer(player);
      this.players.push(player);
    }.bind(this));
  }
, isDead: function(obj){
    console.log('isDead?');
    if(parseInt(obj.style.bottom) <= -10){
      JS.doOnce(function(){
        alert('game over');
      });
    }
  }
, addPlayer: function(attr){
    var player = this.addObject({'class': 'player'})
    player.style.bottom = '300px';
    this.assignKey(attr.keys.right, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(attr.keys.right,  function(e){this.moveRight(player)}.bind(this));
    this.assignKey(attr.keys.left, 'keyup', function(){this.stopMoving()}.bind(this));
    this.assignKey(attr.keys.left,  function(e){this.moveLeft(player)}.bind(this));
    this.assignKey(attr.keys.up,  function(e){this.jump(player)}.bind(this));
    return this.player = player;
  }
, addTiles: function(){
    Tiles.forEach(function(tyle){
      var tile = this.addTile({class: 'tile', left: parseInt(tyle.position.left), bottom: tyle.position.bottom});
      if(tyle.type == 0){
        this.tiles.push(tile);
      }
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
, getLeftValue: function(object){
    var obj = JS.getPosition(object);
    var container = JS.getPosition(object.parentNode);
    return obj.left-container.left;
  }
, moveRight: function(){
    this.isMoving = 4;
    JS.addClass(this.player, 'moving right');
  }
, moveLeft: function(){
    this.isMoving = -4;
    JS.addClass(this.player, 'moving left');
  }
, stopMoving: function(){
    this.isMoving = false;
    JS.removeClass(this.player, 'moving left right');
  }
, jump: function(){
    this.isJumping = true;
  }
, doJump: function(obj){
    this.isJumpColliding(obj, function(obj, baseline){
      var bottom = this.physics.jump(obj, baseline);
      obj.style.bottom = bottom+'px';
      if(bottom <= obj.baseline) this.isJumping = false;
    }.bind(this));
  }
, isJumpColliding: function(obj, cb){
    obj.baseline = 0;
    this.tiles.forEach(function(tile, index){
      this.physics.collision.direction(obj,tile, function(distance, direction, tile){
        this.resolveCollision(direction, obj, tile);
      }.bind(this))
      if(index == (this.tiles.length-1)){
        cb(obj, obj.baseline);
      }
    }.bind(this));
  }
, resolveCollision: function(direction, obj, tile){
    switch(direction){
      case 'top':
        obj.baseline = tile.top;
        break;
      case 'bottom':
        obj.style.bottom = tile.bottom-parseInt(obj.style.height)+'px';
        this.isJumping = false;
        console.log(this);
        break;
      case 'left':
        obj.style.left = tile.left-parseInt(obj.style.width)+'px';
        this.isJumping = false;
        break;
      case 'right':
        break;
      default:
        return;
    }
  }
};
var game = new Game('window');
