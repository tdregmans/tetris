/**
 * Tetris
 * main.js
 * version: 1.0
 * 
 * Author: Thijs Dregmans
 * Last edited: 2024-01-31
 * 
 * See README.md for more information.
 */

// define canvas and context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Get the canvas dimensions
let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

/** ************************************************************************************** */

const ENTRY_SIZE = 15;
const FIELD_HORIZONTAL_SIZE = 15;
const FIELD_VERTICAL_SIZE = 30;

const EMTPY_BLOCK = "#808080";
const BLOCK_TYPE_1 = "#FF2222";
const BLOCK_TYPE_2 = "#22FF22";
const BLOCK_TYPE_3 = "#2222FF";
const BLOCK_TYPE_4 = "#FFFF22";
const BLOCK_TYPE_5 = "#22FFFF";
const BLOCK_TYPE_6 = "#FF22FF";
const BLOCK_TYPE_7 = "#FF9021";

const BLOCK_TYPES = [BLOCK_TYPE_1, BLOCK_TYPE_2, BLOCK_TYPE_3, BLOCK_TYPE_4, BLOCK_TYPE_5, BLOCK_TYPE_6, BLOCK_TYPE_7];

const TIMER_MIN_INTERVAL = 100;
const TIMER_MAX_INTERVAL = 1000;
const TIMER_INTERVAL_STEPS = 10;

/** ************************************************************************************** */

class Field {
  constructor(horizontalSize, verticalSize) {
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;
    this.grid = [];

    for (var x = 0; x < horizontalSize; x++) {
      var column = [];
      for (var y = 0; y < verticalSize; y++) {
        column.push(EMTPY_BLOCK);
      }
      this.grid.push(column);
    }

  }

  getEntry(x, y) {
    return this.grid[x][y];
  }

  setEntry(x, y, newValue) {
    this.grid[x][y] = newValue;
  }

  draw() {
    for (let x = 0; x < this.horizontalSize; x++) {
      for (let y = 0; y < this.verticalSize; y++) {

        drawEntry(x, y, this.getEntry(x, y));
        
      }
    }
    field.drawObject(currentTetrisObject);
  }

  drawObject(currentTetrisObject) {
    var coords = currentTetrisObject.getCoords();
    coords.forEach( coord => {
      drawEntry(coord[0], coord[1],  currentTetrisObject.type );
    });
  }

  moveAllowed(coords) {
    var allowed = true;
    coords.forEach( coord => {
      if (
        coord[0] < 0 || 
        coord[0] >= this.horizontalSize ||
        coord[1] < 0 || 
        coord[1] >= this.verticalSize
      ) {
        // coord is outside the playfield
        allowed = false;
      }

      if (field.getEntry(coord[0], coord[1]) != EMTPY_BLOCK) {
        // coord is already taken by another block
        allowed = false;
      }
    });
    return allowed;
  }

  newObject() {
    var coords = currentTetrisObject.getCoords();
    coords.forEach( coord => {
      this.setEntry(coord[0], coord[1], currentTetrisObject.type);
    });
    currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);
    field.draw();
  }

  clearLines() {
    while (this.clearLine()) { }
    this.draw();
  }

  clearLine() {
    for (let y = 0; y < this.verticalSize; y++) {
      var completeLine = true;
      for (let x = 0; x < this.horizontalSize; x++) {
        if (this.getEntry(x, y) == EMTPY_BLOCK) {
          completeLine = false;
        }
      }
      if (completeLine) {
        // increase score
        score += this.horizontalSize;

        // increase speed
        timer_interval -= (TIMER_MAX_INTERVAL - TIMER_MIN_INTERVAL) / TIMER_INTERVAL_STEPS;
        if (timer_interval < TIMER_MIN_INTERVAL) {
          timer_interval = TIMER_MIN_INTERVAL;
        }

        // move all lines above it one down
        while (y > 0) {
          let newY = y-1;
          this.copyLine(newY, y);
          this.draw();
          y--;
        }
        return true;
      }
    }
    return false;
  }


  copyLine(sourceIndex, targetIndex) {
    for (let x = 0; x < this.horizontalSize; x++) {
      this.setEntry(x, targetIndex, this.getEntry(x, sourceIndex));
    }
  }
}

/** ************************************************************************************** */

const START_COORD = [Math.round(FIELD_HORIZONTAL_SIZE / 2), 0];

const BLOCK_TYPE_1_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-1, 3]
  ],
  [
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0]
  ]
];

const BLOCK_TYPE_2_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [0, 2]
  ],
  [
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0]
  ]
];

const BLOCK_TYPE_3_COORDS = [
  [
    [0, 0],
    [0, 1],
    [-1, 1],
    [-1, 2]
  ],
  [
    [-1, 0],
    [0, 0],
    [0, 1],
    [1, 1]
  ]
];

const BLOCK_TYPE_4_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [-2, 1],
    [0, 1]
  ],
  [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, 1]
  ],
  [
    [-1, 2],
    [-1, 1],
    [-2, 1],
    [0, 1]
  ],
  [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-2, 1]
  ]
];

const BLOCK_TYPE_5_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [0, 0],
    [0, 1]
  ]
];

const BLOCK_TYPE_6_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [0, 0]
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 2]
  ],
  [
    [-1, 0],
    [-1, 1],
    [-1, 2],
    [-2, 2]
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
    [-1, 0]
  ]
];

const BLOCK_TYPE_7_COORDS = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [-1, 0]
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0]
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2]
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
    [-1, 2]
  ]
];

class TetrisObject {
  constructor(type) {
    console.log(type);
    this.type = type;
    this.variant = 0;

    if (type == BLOCK_TYPE_1) {
      this.rotateCoords = BLOCK_TYPE_1_COORDS;
    }
    if (type == BLOCK_TYPE_2) {
      this.rotateCoords = BLOCK_TYPE_2_COORDS;
    }
    if (type == BLOCK_TYPE_3) {
      this.rotateCoords = BLOCK_TYPE_3_COORDS;
    }
    if (type == BLOCK_TYPE_4) {
      this.rotateCoords = BLOCK_TYPE_4_COORDS;
    }
    if (type == BLOCK_TYPE_5) {
      this.rotateCoords = BLOCK_TYPE_5_COORDS;
    }
    if (type == BLOCK_TYPE_6) {
      this.rotateCoords = BLOCK_TYPE_6_COORDS;
    }
    if (type == BLOCK_TYPE_7) {
      this.rotateCoords = BLOCK_TYPE_7_COORDS;
    }
    this.coords = this.addCoords(START_COORD, this.rotateCoords[this.variant]);

    // check if coords of new object are empty
    if (! field.moveAllowed(this.coords)) {
      // game over
      gameOver();
    }

  }

  newVariant() {
    console.log(this.variant);
    var maxVariant = this.rotateCoords.length - 1;
    console.log(maxVariant);
    this.variant += 1;

    if (this.variant > maxVariant) {
      this.variant = 0;
    }
  }

  addCoords (start, base) {
    var result = [];
    base.forEach( coord => {
      console.log(coord);  
      result.push([start[0] + coord[0], start[1] + coord[1]]);
    });
    return result;
  }

  moveDown() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0], coord[1] + 1]);
    });

    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      return true;
    }
    else {
      return false;
      // create new object, because the current cannot be moved down
    }
  }

  left() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0] - 1, coord[1]]);
    });
    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      return true;
    }
    else {
      return false;
    }
  }

  right() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0] + 1, coord[1]]);
    });
    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      return true;
    }
    else {
      return false;
    }
  }

  down() {
    while (this.moveDown()) { }
  }

  rotate() {
    this.newVariant();

    this.coords = this.addCoords(START_COORD, this.rotateCoords[this.variant]);
  }

  getCoords() {
    return this.coords;
  }
}

/** ************************************************************************************** */

function drawEntry(xIndex, yIndex, color) {
  const startX = (width - (FIELD_HORIZONTAL_SIZE * ENTRY_SIZE)) / 1.5;
  const startY = (height - (FIELD_VERTICAL_SIZE * ENTRY_SIZE)) / 2;
  const x = (xIndex * ENTRY_SIZE) + startX;
  const y = (yIndex * ENTRY_SIZE) + startY;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, ENTRY_SIZE, ENTRY_SIZE);
}

/** ************************************************************************************** */

let active = true;

var timer_interval = TIMER_MAX_INTERVAL;
var timer = setInterval(main, timer_interval);

function startStop() {
  if (active) {
    document.getElementById("button").innerText = "Continue";
    clearInterval(timer);
  }
  else {
    document.getElementById("button").innerText = "Pause";
    timer = setInterval(main, timer_interval);
  }
  active = !active;
}

function gameOver() {
  startStop();
  document.getElementById("button").innerText = "Restart";
  score = 0;
  timer_interval = TIMER_MAX_INTERVAL;
  field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

}

/** ************************************************************************************** */

var field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

var currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);

var score = 0;
var topscore = 0;

function main() {
  field.clearLines();
  var createNew = !currentTetrisObject.moveDown();
  if (createNew) {
    field.newObject();
  }
  else {
    field.draw();
  }

  if (score > topscore) {
    topscore = score;
  }

  document.getElementById("score").innerText = score;
  document.getElementById("topscore").innerText = topscore;
}

window.addEventListener(
  "keydown",
  (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    if (active) {
      switch (event.key) {
        case "ArrowDown":
          // Do something for "down arrow" key press.
          currentTetrisObject.down();
          field.draw();
          break;
        case "ArrowUp":
          // Do something for "up arrow" key press.
          currentTetrisObject.rotate();
          field.draw();
          break;
        case "ArrowLeft": 
          // Do something for "left arrow" key press.
          currentTetrisObject.left();
          field.draw();
          break;
        case "ArrowRight":
          // Do something for "right arrow" key press.
          currentTetrisObject.right();
          field.draw(); 
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  true,
);

// execute code
if (canvas.getContext) {
    // drawing code here
    console.log("drawing...");
    field.draw();
} 
else {
    // canvas-unsupported code here
    console.log("canvas not supported!");
}
