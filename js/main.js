/**
 * Tetris
 * main.js
 * version: 1.0
 * 
 * Author: Thijs Dregmans
 * Last edited: 2024-01-28
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

const EMTPY_BLOCK = 0;
const STANDARD_BLOCK = 1;
const BLOCK_TYPE_1 = 2;
const BLOCK_TYPE_2 = 3;
const BLOCK_TYPE_3 = 4;
const BLOCK_TYPE_4 = 5;
const BLOCK_TYPE_5 = 6;

const BLOCK_TYPES = [EMTPY_BLOCK, STANDARD_BLOCK, BLOCK_TYPE_1, BLOCK_TYPE_2, BLOCK_TYPE_3, BLOCK_TYPE_4, BLOCK_TYPE_5];

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

    // for (let x = 0; x < this.horizontalSize; x++) {
    //   for (let y = 0; y < this.verticalSize; y++) {
    //     drawEntry(x, y, "#808080");
    //   }
    // } 

  }

  getEntry(x, y) {
    return this.grid[x][y];
  }

  draw(currentTetrisObject) {
    for (let x = 0; x < this.horizontalSize; x++) {
      for (let y = 0; y < this.verticalSize; y++) {

        var coords = currentTetrisObject.getCoords();
        coords.forEach( coord => {
          let alreadyDrawn = true;
          if (coord[0] == x && coord[1] == y) {
            drawEntry(x, y, "#00FF00");
            console.log(coord + ": green");
            alreadyDrawn = false;
          }
          else {
            // if (!alreadyDrawn) {
              drawEntry(x, y, "#808080");
            // }
          }
        });
        
      }
    } 
    console.log("----");
  }
}

/** ************************************************************************************** */

class TetrisObject {
  constructor(type) {
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
    this.coords = newCoords;
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

var currentTetrisObject = new TetrisObject(BLOCK_TYPE_2);

function main() {
  currentTetrisObject.moveDown();

  field.draw(currentTetrisObject);
}

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
