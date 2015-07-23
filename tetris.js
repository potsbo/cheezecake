var FIELD_W = 300, FIELD_H = 600;
var COLS = 10, ROWS = 20;
var BLOCK_W = FIELD_W / COLS, BLOCK_H = FIELD_H / ROWS;
var canvas = document.getElementById("field");
var ctx= canvas.getContext("2d");
var current_x = 3, current_y = 0;
var current_mino;
var field = [];
var erasedLine = 0;

for (var y = 0; y < ROWS; y++) {
  field[y] = [];
  for (var x = 0; x < COLS; x++) {
    field[y][x] = 0;
  }
}

current_mino = newMino();
render();
setInterval(tick, 500);



function render() {
  //  ctx.clearRect(0, 0, FIELD_W, FIELD_H);
  ctx.clearRect(0, 0, 600, 600);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, 300, 600);
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      drawBlock(x, y, field[y][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      drawBlock(current_x + x, current_y + y, current_mino[y][x]);
    }
  }
  ctx.font = "bold 40px Century Gothic"
  ctx.fillStyle = "black";
  ctx.fillText("LINE", 350, 100);
  ctx.fillText(erasedLine, 500, 100);
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
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
  }
  render();
}

function fix() {
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x + x] = current_mino[y][x];
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
      if (next_mino[y][x]) {
        if (next_y + y >= ROWS || next_x + x < 0 || next_x + x >= COLS || field[next_y + y][next_x + x]) {
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
      render();
      break;
    case 39:
      if (canMove(1, 0))
        current_x++;
      render();
      break;
    case 40:
      if (canMove(0, 1))
        current_y++;
      render();
      break;
    case 38:
      rotated = rotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
      }
      render();
      break;
	case 32:
	  while(canMove(0,1)){
		  current_y++;
	  }
	  break;
  }
}

function clearRows() {
  for (var y = ROWS - 1; y >= 0; y--) {
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
    }
  }
}
