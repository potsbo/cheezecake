var Game = (function() {
  var FIELD_W = 300, FIELD_H = 600;
  var COLS = 10, ROWS = 20;
  var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;

  var Game = function(){
    this.score = 0;
    this.clock = 1000;
    this.level = 0;
    this.map = [];
    this.current_mino = new Tetrimino();
    this.holdMino = new Tetrimino();
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
  };

  var p = Game.prototype;

  p.render = function (){
    this.ctx.clearRect(0, 0, FIELD_W *2, FIELD_H);
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(0, 0, FIELD_W, FIELD_H);
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
    this.ctx.fillText("LINE", 350, 100);
    this.ctx.fillText(this.erasedLineTotal, 500, 100);

    this.ctx.fillText("SCORE", 350, 150);
    this.ctx.fillText(this.score, 500, 150);

    this.ctx.fillText("LEVEL", 350, 200);
    this.ctx.fillText(this.level, 500, 200);
  };

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

  p.drawBlock = function(x, y, block) {
    if (block) {
      this.ctx.fillStyle = COLORS[block - 1];
      this.ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
      this.ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
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

  p.tick = function(){
    if (this.canMove(0, 1)) {
      this.current_mino.y++;
    } else {
      this.fix();
      this.clearRows();
      this.level = Math.floor(this.score / 1000);
      this.clock = this.getClock();
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
        gameOver = true;
        alert("Game Over");
      }
    }
    this.render();

    if (!this.gameOver) {
      var obj = this;
      var func = function () {
        obj.tick();
      };
      setTimeout(func, this.clock);
    }
  };

  p.fix = function(){
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        if (this.current_mino.mino[y][x]) {
          this.map[this.current_mino.y + y][this.current_mino.x + x] = this.current_mino.mino[y][x];
        }
      }
    }
  };

  p.hold = function (){
    if(this.current_mino.holdable){
      this.current_mino.holdable = false;
      var tmp = this.current_mino;
      this.current_mino = this.holdMino;
      this.holdMino = tmp;
      for(var i = 0; i < 4; i++){
        if(this.current_mino.mino[0][i]){
          if(this.canMove(0,1)){
            this.current_mino.y++;
          }
          break;
        }
      }
    }
  };

  p.getClock = function(){
    return 1000 - 200 * this.level;
  };

  p.run = function (){
    this.current_mino = new Tetrimino();
    for(var i = 0; i < 4; i++){
      if(this.current_mino.mino[0][i]){
        if(this.canMove(0,1)){
          this.current_mino.y++;
        }
        break;
      }
    }
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

  return Game;
})();

var game = new Game();
game.run();

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      game.move(-1, 0);
      break;
    case 39:
      game.move(1, 0);
      break;
    case 40:
      game.move(0, 1);
      break;
    case 38:
      game.rotateR();
      break;
    case 81: // q
      game.rotateL();
      break;
    case 74: // j
      game.rotateR();
      break;
    case 32:
      game.hardDrop();
      break;
    case 80:
      alert("pause");
      break;
    case 79:
      game.hold();
      break;
  }
  game.render();
}

