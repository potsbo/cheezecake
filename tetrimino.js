
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

var Tetrimino = (function() {

  var Tetrimino = function() {
    this.id;
    this.mino = [];
    this.val = [];
    this.valSum = 0;
    this.x = 3;
    this.y = 0;
    
    for(var minoNum = 0; minoNum < MINOS.length; minoNum++){
      this.val[minoNum] = 100;
      var i = 0;
      while(formerlist[i] == minoNum){
        this.val[minoNum] /= 2;
        i++;
      }
      while(i < 10){
  	    if(formerlist[i] == minoNum){
          this.val[minoNum] -= Math.floor((10-i)^1.5);
  	    }
  	  i++;
  	  }
      this.valSum += this.val[minoNum];

    }
  
    while(true){
      this.id = Math.floor(Math.random() * MINOS.length);
  	  if(Math.floor(Math.random()*this.valSum) < this.val[this.id]){
  	    break;
  	  }
    }
    for (var y = 0; y < 4; y++) {
      this.mino[y] = [];
      for (var x = 0; x < 4; x++) {
        this.mino[y][x] = 0;
        if (MINOS[this.id][y]) {
          if (MINOS[this.id][y][x]) {
            this.mino[y][x] = this.id + 1;
          } 
        }
      }
    }
    for(var i = 9; i > 0; i--){
      formerlist[i] = formerlist[i-1];
    }
    formerlist[0] = this.id;
  };

  var p = Tetrimino.prototype;

  p.getMino = function (){
    return this.mino;
  };

  p.rotateL = function (){
    var rotated = [];
    if (this.id < 2) {
      for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
          rotated[y][x] = this.mino[x][3 - y];
        }
      }
    } else {
      for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 3; ++x) {
          rotated[y][x] = this.mino[x][2 - y];
        }
        rotated[y][3] = 0;
      }
    }
    this.mino = rotated;
    return this.mino;
  };

  p.rotateR = function() {
    var rotated = [];
    if (this.id < 2) {
      for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 4; ++x) {
          rotated[y][x] = this.mino[-x+3][y];
        }
      }
    } else {
      for (var y = 0; y < 4; ++y) {
        rotated[y] = [];
        for (var x = 0; x < 3; ++x) {
          rotated[y][x] = this.mino[-x+2][y];
        }
  	  rotated[y][3] = 0;
      }
    }
    this.mino = rotated;
    return this.mino;
  };

  return Tetrimino;
})();
