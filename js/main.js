/**
 * Tetris
 * main.js
 * version: 1.0
 * 
 * Author: Thijs Dregmans
 * Last edited: 2024-01-30
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
const STANDARD_BLOCK = 1;
const BLOCK_TYPE_1 = "#FF2222";
const BLOCK_TYPE_2 = "#22FF22";
const BLOCK_TYPE_3 = "#2222FF";
const BLOCK_TYPE_4 = "#FFFF22";
const BLOCK_TYPE_5 = "#22FFFF";

const BLOCK_TYPES = [BLOCK_TYPE_1, BLOCK_TYPE_2, BLOCK_TYPE_3, BLOCK_TYPE_4, BLOCK_TYPE_5];

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
    console.log("new object");
    var coords = currentTetrisObject.getCoords();
    coords.forEach( coord => {
      this.setEntry(coord[0], coord[1], currentTetrisObject.type);
    });
    currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);
    field.draw();
  }
}

/** ************************************************************************************** */

class TetrisObject {
  constructor(type) {
    this.type = type;
    console.log(type);
    if (type == STANDARD_BLOCK) {
      this.coords = [[Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 0]];
    }
    if (type == BLOCK_TYPE_1) {
      this.coords = [
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 2],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 3]
      ];
    }
    if (type == BLOCK_TYPE_2) {
      this.coords = [
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 2]
      ];
    }
    if (type == BLOCK_TYPE_3) {
      this.coords = [
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 2]
      ];
    }
    if (type == BLOCK_TYPE_4) {
      this.coords = [
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 2, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 1]
      ];
    }
    if (type == BLOCK_TYPE_5) {
      this.coords = [
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2) - 1, 1],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 0],
        [Math.round(FIELD_HORIZONTAL_SIZE / 2), 1]
      ];
    }
  }

  moveDown() {
    var newCoords = [];
    this.coords.forEach(coord => {
      newCoords.push([coord[0], coord[1] + 1]);
    });

    console.log(this.coords);
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
    while (this.moveDown()) {
      console.log("move down");
    }
    
    // field.newObject();
  }

  rotate() {

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

var timer = setInterval(main, 1000);

function startStop() {
  if (active) {
    document.getElementById("button").innerText = "Continue";
    clearInterval(timer);
  }
  else {
    document.getElementById("button").innerText = "Pause";
    timer = setInterval(main, 1000);
  }
  active = !active;
}

/** ************************************************************************************** */

var field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

var currentTetrisObject = new TetrisObject(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)]);

function main() {
  console.log("main");
  var createNew = !currentTetrisObject.moveDown();
  if (createNew) {
    console.log(createNew);
    field.newObject();
  }
  else {
    field.draw();
  }
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
