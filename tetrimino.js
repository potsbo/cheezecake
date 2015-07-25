var MINOS = [
  [ // I red
    [0, 0, 0, 0],
    [1, 1, 1, 1]
  ],
  [ // O yellow
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0]
  ],
  [ // S magenta
    [0, 1, 1, 0],
    [1, 1, 0, 0]
  ],
  [ // Z green
    [1, 1, 0, 0],
    [0, 1, 1, 0]
  ],
  [ // J blue
    [1, 0, 0, 0],
    [1, 1, 1, 0]
  ],
  [ // L orange
    [0, 0, 1, 0],
    [1, 1, 1, 0]
  ],
  [ // T cyan
    [0, 1, 0, 0],
    [1, 1, 1, 0]
  ]
];

var COLORS = ["red", "yellow", "magenta", "green", "blue", "orange", "cyan"];

var formerlist = [];

function newMino() {
  var val = [];
  var valSum = 0;
  
  for(var minoNum = 0; minoNum < MINOS.length; minoNum++){
    val[minoNum] = 1000;
	if(formerlist[0] == minoNum)
	  val[minoNum] = 1;
    valSum += val[minoNum];
  }
  while(true){
    var id = Math.floor(Math.random() * MINOS.length);
	console.log(id);
	if(Math.floor(Math.random()*valSum) < val[id]){
	  break;
	}
  }
  for(var i = 9; i > 0; i--){
    formerlist[i] = formerlist[i-1];
  }
  formerlist[0] = id;
  
  var mino = [];
  for (var y = 0; y < 4; y++) {
    mino[y] = [];
    for (var x = 0; x < 4; x++) {
      mino[y][x] = 0;
      if (MINOS[id][y]) {
        if (MINOS[id][y][x]) {
          mino[y][x] = id + 1;
        } 
      }
    }
  }
  return mino;
}

function rotate(mino) {
  var rotated = [];
  var minoId = checkMinoType(mino);
  if (minoId <= 2) {
    for (var y = 0; y < 4; ++y) {
      rotated[y] = [];
      for (var x = 0; x < 4; ++x) {
        rotated[y][x] = mino[x][-y + 3];
      }
    }
  } else {
    for (var y = 0; y < 4; ++y) {
      rotated[y] = [];
      for (var x = 0; x < 4; ++x) {
        rotated[y][x] = mino[x][-y + 2];
      }
    }
  }
  return rotated;
}

function checkMinoType(mino) {
  for (var y = 0; y < 4; y++) {
    if (mino[y]){
      for (var x = 0; x < 4; x++) {
        if (mino[y][x] !== 0)
          return mino[y][x];
      }
    }
  }
}
