var FIELD_W = 300, FIELD_H = 600;
var COLS = 10, ROWS = 20;
var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
var canvas = document.getElementById("field");
var ctx= canvas.getContext("2d");
var current_x = 3, current_y = 0;
var current_mino;
var field = [];
var erasedLineTotal = 0;
var score = 0;
var clock = 1000;
var level = 0;
var status;

for (var y = 0; y < ROWS+1; y++) {
  field[y] = [];
  for (var x = 0; x < COLS; x++) {
    field[y][x] = 0;
  }
}

current_mino = newMino();
holdable = true;
for(var i = 0; i < 4; i++){
  if(current_mino.mino[0][i]){
    if(canMove(0,1)){
      current_y++;
    }
    break;
  }
}
render();
if (!status) {
  setTimeout(function(){
    tick();
  }, clock);
}



function render() {
  //  ctx.clearRect(0, 0, FIELD_W, FIELD_H);
  ctx.clearRect(0, 0, 600, 600);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, 300, 600);
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      drawBlock(x, y, field[y+1][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      drawBlock(current_x + x, current_y + y - 1, current_mino[y][x]);
      drawBlock(current_x + x, current_y + y - 1, current_mino.mino[y][x]);
    }
  }
  ctx.font = "bold 30px Century Gothic"
  ctx.fillStyle = "black";
  ctx.fillText("LINE", 350, 100);
  ctx.fillText(erasedLineTotal, 500, 100);

  ctx.font = "bold 30px Century Gothic"
  ctx.fillText("SCORE", 350, 150);
  ctx.fillText(score, 500, 150);

  ctx.font = "bold 30px Century Gothic"
  ctx.fillText("LEVEL", 350, 200);
  ctx.fillText(level, 500, 200);
}

function drawBlock(x, y, block) {
  if (block) {
    ctx.fillStyle = COLORS[block - 1];
    ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1)
    ctx.strokeRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1);
  }
}

function tick() {
  if (canMove(0, 1)) {
    current_y++;
  } else {
    fix();
    clearRows();
    level = Math.floor(score / 1000)
    clock = getClock();
    holdable = true;
    current_mino = new Tetrimino();
    current_x = 3;
    current_y = 0;
    for(var i = 0; i < 4; i++){
      if(current_mino.mino[0][i]){
        if(canMove(0,1)){
          current_y++;
	    }
	    break;
      }
	}
    if(!canMove(0,0)){
      render();
      status = 1;
      alert("Game Over");
    }
  }
  render();
  if (!status) {
    setTimeout(function(){
      tick();
    }, clock);
  }
}

function fix() {
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (current_mino.mino[y][x]) {
        field[current_y + y][current_x + x] = current_mino.mino[y][x];
      }
    }
  }
}

function canMove(move_x, move_y, move_mino) {
  var next_x = current_x + move_x;
  var next_y = current_y + move_y;
  var next_mino = move_mino || current_mino;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (next_mino.mino[y][x]) {
        if (next_y + y >= ROWS + 1 || next_x + x < 0 || next_x + x >= COLS || field[next_y + y][next_x + x]) {
          return false;
        }
      }
    }
  }
  return true;
}

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      if (canMove(-1, 0))
        current_x--;
      break;
    case 39:
      if (canMove(1, 0))
        current_x++;
      break;
    case 40:
      if (canMove(0, 1))
        current_y++;
      break;
    case 38:
      current_mino.rotateR();
      if (!canMove(0, 0))
          current_mino.rotateL();
      break;
    case 81: // q
      current_mino.rotateL();
      if (!canMove(0, 0))
          current_mino.rotateR();
      break;
    case 74: // j
      current_mino.rotateR();
      if (!canMove(0, 0))
          current_mino.rotateL();
      break;
    case 32:
      while(canMove(0,1)){
        current_y++;
        score++;
      }
      fix();
      break;
    case 80:
      alert("pause");
      break;
    case 79:
      current_mino = hold(current_mino);
      break;
  }
  render();
}

function clearRows() {
  var erasedLine = 0;
  for (var y = ROWS; y >= 0; y--) {
    var fill = true;
    for (var x = 0; x < COLS; x++) {
      if (field[y][x] == 0) {
        fill = false;
        break;
      }
    }
    if (fill) {
      for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < COLS; x++) {
          field[v + 1][x] = field[v][x];
        }
      }
      y++;
      erasedLine++;
      erasedLineTotal++;
    }
  }
  switch (erasedLine) {
    case 1:
      score += 40;
      break;
    case 2:
      score += 100;
      break;
    case 3:
      score += 300;
      break;
    case 4:
      score += 1200;
      break;
  }
}

var holdable = true;
var holdMino = newMino();
function hold(current_mino){
  if(holdable){
    holdable = false;
    tmp = holdMino;
    holdMino = current_mino;
      current_x = 3;
      current_y = 0;
      for(var i = 0; i < 4; i++){
        if(tmp[0][i]){
          if(canMove(0,1)){
            current_y++;
          }
        break;
        }
      }
    return tmp;
  }else{
    return current_mino;
  }
}

function getClock() {
  return 1000 - 200 * level;
}
