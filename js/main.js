/**
 * Tetris
 * main.js
 * version: 1.0
 * 
 * Author: Thijs Dregmans
 * Last edited: 2024-02-04
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

// Block types by color
const EMTPY_BLOCK = "#808080";
const BLOCK_TYPE_1 = "#FF2222";
const BLOCK_TYPE_2 = "#22FF22";
const BLOCK_TYPE_3 = "#2222FF";
const BLOCK_TYPE_4 = "#FFFF22";
const BLOCK_TYPE_5 = "#22FFFF";
const BLOCK_TYPE_6 = "#FF22FF";
const BLOCK_TYPE_7 = "#FF9021";

const BLOCK_TYPES = [BLOCK_TYPE_1, BLOCK_TYPE_2, BLOCK_TYPE_3, BLOCK_TYPE_4, BLOCK_TYPE_5, BLOCK_TYPE_6, BLOCK_TYPE_7];

// Timer variables
const TIMER_MIN_INTERVAL = 100;
const TIMER_MAX_INTERVAL = 1000;
const TIMER_INTERVAL_STEPS = 10;

/** ************************************************************************************** */

/**
* Object with grid to easily access the entries in the field
*/
class Field { 

  constructor(horizontalSize, verticalSize) {
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;
    this.grid = [];

    // Fill field with empty blocks
    for (var x = 0; x < horizontalSize; x++) {
      var column = [];
      for (var y = 0; y < verticalSize; y++) {
        column.push(EMTPY_BLOCK);
      }
      this.grid.push(column);
    }
  }

  /**
   * Return the color at (x, y)
   */
  getEntry(x, y) {
    return this.grid[x][y];
  }

  /**
   * Update the value at (x, y) with newValue
   */
  setEntry(x, y, newValue) {
    this.grid[x][y] = newValue;
  }

  /**
   * Draw the Field in the canvas, including the currentTetrisObject
   */
  draw() {
    for (let x = 0; x < this.horizontalSize; x++) {
      for (let y = 0; y < this.verticalSize; y++) {

        drawEntry(x, y, this.getEntry(x, y));
        
      }
    }
    field.drawObject(currentTetrisObject);
  }

  /**
   * Draw the currentTetrisObject
   */
  drawObject(currentTetrisObject) {
    var coords = currentTetrisObject.getCoords();
    coords.forEach( coord => {
      drawEntry(coord[0], coord[1],  currentTetrisObject.type );
    });
  }

  /**
   * Check if a any of a set of coordinates is filled by any block, other than EMPTY_BLOCK
   */
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

  /**
   * Create a new TetrisObject and draw the field
   */
  newObject() {
    var coords = currentTetrisObject.getCoords();
    coords.forEach( coord => {
      this.setEntry(coord[0], coord[1], currentTetrisObject.type);
    });
    currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);
    field.draw();
  }

  /**
   * Clear redraw the field, leaving all completed rows out, by moving all rows above them down
   */
  clearLines() {
    while (this.clearLine()) { }
    this.draw();
  }

  /**
   * Clear redraw the field, leaving the first completed row out, by moving all rows above it down
   */
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

  /**
   * Copy an entire row in the Field from the row of sourceIndex to the row of targetIndex
   */
  copyLine(sourceIndex, targetIndex) {
    for (let x = 0; x < this.horizontalSize; x++) {
      this.setEntry(x, targetIndex, this.getEntry(x, sourceIndex));
    }
  }
}

/** ************************************************************************************** */

/**
 * The starting point of all tetrisObjects
 */
const START_COORD = [Math.round(FIELD_HORIZONTAL_SIZE / 2), 0];

// Coordinates of block types and their variants (rotations)

/**
 * Coordinates of block 1 with its variants (rotations)
 */
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

/**
 * Coordinates of block 2 with its variants (rotations)
 */
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

/**
 * Coordinates of block 3 with its variants (rotations)
 */
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

/**
 * Coordinates of block 4 with its variants (rotations)
 */
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

/**
 * Coordinates of block 5 with its variants (rotations)
 */
const BLOCK_TYPE_5_COORDS = [
  [
    [-1, 0],
    [-1, 1],
    [0, 0],
    [0, 1]
  ]
];

/**
 * Coordinates of block 6 with its variants (rotations)
 */
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

/**
 * Coordinates of block 7 with its variants (rotations)
 */
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

/** ************************************************************************************** */

/**
* The TetrisObject that moves down.
*/
class TetrisObject {
  constructor(type) {
    this.type = type;
    this.variant = 0;

    // make the starting point the current point
    this.mainCoord = START_COORD;

    // Add the variants to the rotateCoords artibute
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

    // create the coordinates from the curent point and the current variant
    this.coords = this.addCoords(this.mainCoord, this.rotateCoords[this.variant]);

    // check if coords of new object are empty
    if (! field.moveAllowed(this.coords)) {
      gameOver();
    }
  }

  /**
   * Increase the pointer that points to the current variant
   */
  increaseVariantPointer() {
    var maxVariant = this.rotateCoords.length - 1;
    this.variant += 1;

    if (this.variant > maxVariant) {
      this.variant = 0;
    }
  }

  /**
   * Create the coordinates from the start point and a set of base coordinates by adding them together.
   */
  addCoords (start, base) {
    var result = [];
    base.forEach( coord => {
      result.push([start[0] + coord[0], start[1] + coord[1]]);
    });
    return result;
  }

  /**
   * Move the whole TetrisObject one down if allowed
   */
  moveDown() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0], coord[1] + 1]);
    });

    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      this.mainCoord = [this.mainCoord[0], this.mainCoord[1] + 1];
      return true;
    }
    else {
      return false;
      // create new object, because the current cannot be moved down
    }
  }

  /**
   * Move the whole TetrisObject one left if allowed
   */
  left() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0] - 1, coord[1]]);
    });
    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      this.mainCoord = [this.mainCoord[0] - 1, this.mainCoord[1]];
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Move the whole TetrisObject one right if allowed
   */
  right() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0] + 1, coord[1]]);
    });
    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
      this.mainCoord = [this.mainCoord[0] + 1, this.mainCoord[1]];
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Move the whole TetrisObject down until it is no longer allowed
   */
  down() {
    while (this.moveDown()) { }
  }

  /**
   * Rotate the whole TetrisObject by switching to a new variant, if it is allowed
   */
  rotate() {
    this.increaseVariantPointer();

    // create the coordinates from the curent point and the current variant
    var newCoords = this.addCoords(this.mainCoord, this.rotateCoords[this.variant]);
    if (field.moveAllowed(newCoords)) {
      this.coords = newCoords;
    }
    else {
      // rotation nog allowed
      this.variant =- 1;
    }
  }

  /**
   * Retrieve the current set of coordinates
   */
  getCoords() {
    return this.coords;
  }
}

/** ************************************************************************************** */

/**
 * helpfunction: draw the entry in the canvas with the correct color at the provided indices
 */
function drawEntry(xIndex, yIndex, color) {
  const startX = (width - (FIELD_HORIZONTAL_SIZE * ENTRY_SIZE)) / 1.5;
  const startY = (height - (FIELD_VERTICAL_SIZE * ENTRY_SIZE)) / 2;
  const x = (xIndex * ENTRY_SIZE) + startX;
  const y = (yIndex * ENTRY_SIZE) + startY;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, ENTRY_SIZE, ENTRY_SIZE);
}

/**
 * handler: stop or start the game based on the click of the button
 */
function startStop() {
  if (active) {
    document.getElementById("button").innerText = "Continue";
    clearTimeout(timer);
  }
  else {
    document.getElementById("button").innerText = "Pause";
    timer = setTimeout(main, timer_interval);
  }
  active = !active;
}

/**
 * helpfunction: reset game state, timer and field
 */
function gameOver() {
  // startStop();
  document.getElementById("button").innerText = "Restart";
  active = false;
  clearTimeout(timer);
  score = 0;
  timer_interval = TIMER_MAX_INTERVAL;
  field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

}

/** ************************************************************************************** */

/**
 * Boolean indicating whether the game is active or not. It can paused or have ended, in which case it is set to false.
 */
var active = true;

// Timer
var timer_interval = TIMER_MAX_INTERVAL;
var timer = setTimeout(main, timer_interval);

// Field
var field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

// CurrentTetrisObject
var currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);

// Score
var score = 0;
var topscore = 0;

/**
 * Main function, called by timer at each timout.
 * Clears lines, moves the currentTetrisObject down, creates a new object if needed and increases the score.
 * Calls itself recursively with the timer to keep the game going.
 */
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
  if (active) {

    timer = setTimeout(main, timer_interval);
  }
}

/**
 * Keyhandler: Handles the key presses on the keyboard.
 */
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
