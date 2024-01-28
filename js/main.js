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


const ENTRY_SIZE = 15;
const FIELD_HORIZONTAL_SIZE = 15;
const FIELD_VERTICAL_SIZE = 30;

const ENTRIES_TYPES = [0, 1, 2, 3, 4, 5, 6];
const EMPTY_ENTRY = {
  "id": 0,
  "color": "#808080"
}

class Entry {
  constructor(id, color) {
    this.id = id;
    this.color = color;
  }

  getId() {
    return this.id;
  }

  getColor() {
    return this.color;
  }
}

class Block {
  constructor(type) {
    this.type = type;
  }
  
}

class Field {
  constructor(horizontalSize, verticalSize) {
    this.horizontalSize = horizontalSize;
    this.verticalSize = verticalSize;
    this.grid = [];

    for (var x = 0; x < horizontalSize; x++) {
      var column = [];
      for (var y = 0; y < verticalSize; y++) {
        column.push(new Entry(EMPTY_ENTRY["id"], EMPTY_ENTRY["color"]));
      }
      this.grid.push(column);
    }

  }

  getEntry(x, y) {
    return this.grid[x][y];
  }

  draw() {
    for (let x = 0; x < this.horizontalSize; x++) {
      for (let y = 0; y < this.verticalSize; y++) {
        drawEntry(x, y, this.getEntry(x, y).getColor());
      }
    } 
  }
}

var field = new Field(FIELD_HORIZONTAL_SIZE, FIELD_VERTICAL_SIZE);

function drawEntry(xIndex, yIndex, color) {
  const startX = (width - (FIELD_HORIZONTAL_SIZE * ENTRY_SIZE)) / 1.5;
  const startY = (height - (FIELD_VERTICAL_SIZE * ENTRY_SIZE)) / 2;
  const x = (xIndex * ENTRY_SIZE) + startX;
  const y = (yIndex * ENTRY_SIZE) + startY;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, ENTRY_SIZE, ENTRY_SIZE);
}

let active = true;

function startStop() {
  if (active) {
    document.getElementById("mode-dropdown").setAttribute("disabled", "disabled");
  }
  else {
    document.getElementById("mode-dropdown").removeAttribute("disabled");
  }
  active = !active;
}

// execute code
if (canvas.getContext) {
    // drawing code here
    console.log("drawing...");
    field.draw();
    // canvas.addEventListener('click', function(e) {

    //   if(active) {
        
    //   }

    // });
    
} 
else {
    // canvas-unsupported code here
    console.log("canvas not supported!");
}
