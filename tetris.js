var Game = (function() {
  var FIELD_W = 300, FIELD_H = 600;
  var COLS = 10, ROWS = 20;
  var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
  var HOLD_W = BLOCK_W * 6, HOLD_H = BLOCK_H * 6;

  var Game = function(){
    this.init();
  };

  var p = Game.prototype;
  p.init = function(){
    this.score = 0;
    this.clock = 1000;
    this.level = 0;
    this.map = [];
    this.current_mino = new Tetrimino();
    this.erasedLineTotal = 0;
    this.gameOver = false;
    this.canvas = document.getElementById("field");
    this.ctx= this.canvas.getContext("2d");

    for (var y = 0; y < ROWS+1; y++) {
      this.map[y] = [];
      for (var x = 0; x < COLS; x++) {
        this.map[y][x] = 0;
      }
    }
  }

  p.render = function (){
    this.ctx.clearRect(HOLD_W, 0, FIELD_W *2, FIELD_H);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(HOLD_W, 0, FIELD_W, FIELD_H);
    this.ctx.strokeRect(0, 0, HOLD_W, 200);
    for (var y = 0; y < ROWS; y++) {
      for (var x = 0; x < COLS; x++) {
        this.drawBlock(x, y, this.map[y+1][x]);
      }
    }
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        this.drawBlock(this.current_mino.x + x, this.current_mino.y + y - 1, this.current_mino.mino[y][x]);
      }
    }
    this.ctx.font = "bold 30px Century Gothic";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("LINE", HOLD_W + FIELD_W + 50, 100);
    this.ctx.fillText(this.erasedLineTotal, HOLD_W + FIELD_W + 200, 100);

    this.ctx.fillText("SCORE", HOLD_W + FIELD_W + 50, 150);
    this.ctx.fillText(this.score, HOLD_W + FIELD_W + 200, 150);

    this.ctx.fillText("LEVEL", HOLD_W + FIELD_W + 50, 200);
    this.ctx.fillText(this.level, HOLD_W + FIELD_W + 200, 200);

  };

  p.renderHold = function(){
    this.ctx.clearRect(0, 0, HOLD_W, HOLD_H);
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        this.drawHoldBlock(this.holdMino.x + x, this.holdMino.y + y - 1, this.holdMino.mino[y][x]);
      }
    }
  }

  p.canMove = function (move_x, move_y, move_mino) {
    var next_x = this.current_mino.x + move_x;
    var next_y = this.current_mino.y + move_y;
    var next_mino = move_mino || this.current_mino;
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        if (next_mino.mino[y][x]) {
          if (next_y + y >= ROWS + 1 || next_x + x < 0 || next_x + x >= COLS || this.map[next_y + y][next_x + x]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  p.drawHoldBlock = function(x, y, block){
    this.drawBlock(x-8, y+3, block);
  }

  p.drawBlock = function(x, y, block) {
    if (block) {
      this.ctx.fillStyle = COLORS[block - 1];
      this.ctx.fillRect(HOLD_W + x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
      this.ctx.strokeRect(HOLD_W + x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
    }
  };

  p.clearRows = function() {
    var erasedLine = 0;
    for (var y = ROWS; y >= 0; y--) {
      var fill = true;
      for (var x = 0; x < COLS; x++) {
        if (this.map[y][x] == 0) {
          fill = false;
          break;
        }
      }
      if (fill) {
        for (var v = y - 1; v >= 0; v--) {
          for (var x = 0; x < COLS; x++) {
            this.map[v + 1][x] = this.map[v][x];
          }
        }
        y++;
        erasedLine++;
        this.erasedLineTotal++;
      }
    }
    switch (erasedLine) {
      case 1:
        this.score += 40;
        break;
      case 2:
        this.score += 100;
        break;
      case 3:
        this.score += 300;
        break;
      case 4:
        this.score += 1200;
        break;
    }
  };

  p.createNewMino = function(){
    this.current_mino = new Tetrimino();
    for(var i = 0; i < 4; i++){
      if(this.current_mino.mino[0][i]){
        if(this.canMove(0,1)){
          this.current_mino.y++;
        }
        break;
      }
    }
    if(!this.canMove(0,0)){
      this.render();
      this.gameOver = true;
      var result = confirm("GAME OVER\n restart?");
      if(result){
        this.restart();
      }
    }
  };

  p.tick = function(){
    if (this.canMove(0, 1)) {
      this.current_mino.y++;
    } else {
      this.fix();
    }
    this.render();
    if(!this.gameOver){
      var obj = this;
      var func = function () {
        obj.tick();
      };
      setTimeout(func, this.clock);
    }
  };

  p.fix = function(){
    if(!this.gameOver){
      for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
          if (this.current_mino.mino[y][x]) {
            this.map[this.current_mino.y + y][this.current_mino.x + x] = this.current_mino.mino[y][x];
          }
        }
      }
      this.clearRows();
      this.createNewMino();
      this.level = Math.floor(this.score / 1000);
      this.clock = this.getClock();
    }
  };

  p.hold = function (){
    if(this.current_mino.holdable){
      this.current_mino.holdable = false;
      var tmp = this.current_mino;
      this.current_mino = this.holdMino || new Tetrimino();
      this.current_mino.reset();
      this.holdMino = tmp;
      this.holdMino.reset();
      for(var i = 0; i < 4; i++){
        if(this.current_mino.mino[0][i]){
          if(this.canMove(0,1)){
            this.current_mino.y++;
          }
          break;
        }
      }
    }
    this.renderHold();
  };

  p.getClock = function(){
    return 1000 - 200 * this.level;
  };

  p.run = function (){
    this.createNewMino();
    this.render();
    var obj = this;
    var func = function () {
      obj.tick();
    };
    setTimeout(func, this.clock);
  };

  p.rotateL = function (){
    this.current_mino.rotateL();
    if (!this.canMove(0, 0))
      this.current_mino.rotateR();
  };

  p.rotateR = function (){
    this.current_mino.rotateR();
    if (!this.canMove(0, 0))
      this.current_mino.rotateL();
  };

  p.move = function(move_x, move_y){
    var x = move_x || 0;
    var y = move_y || 0;
    if (this.canMove(x, y)){
      this.current_mino.x += x;
      this.current_mino.y += y;
    }
  };

  p.hardDrop = function (){
    while(this.canMove(0,1)){
      this.current_mino.y++;
      this.score++;
    }
    this.fix();
  };

  p.restart = function(){
    if(this.gameOver){
      console.log("restarting");
      this.init();
      this.run();
    }
  }

  return Game;
})();

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37: // left arrow
      game.move(-1, 0);
      break;
    case 39: // riht arrow
      game.move(1, 0);
      break;
    case 40: // down arrow
      game.move(0, 1);
      break;
    case 38: // up arrow
      game.rotateR();
      break;
    case 81: // q
      game.rotateL();
      break;
    case 74: // j
      game.rotateR();
      break;
    case 32: // space 
      game.hardDrop();
      break;
    case 80: // p
      alert("pause");
      break;
    case 79: // o
      game.hold();
      break;
    case 78: // n
      game.restart();
      break;
  }
  game.render();
}

var game = new Game();
game.run();
