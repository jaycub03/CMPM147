// project.js - dungeon/overworld
// Author: Jacob ganburged
// Date: 4/24/24



/* exported generateGrid, drawGrid */
/* global placeTile*/

let lastToggleTime = 0;
let useAlternate = false;

function generateGrid(numCols, numRows) {
  let grid = [];
  let rooms = [];
  
  // Initialize all cells as walls
  for (let i = 0; i < numRows; i++) {
    grid.push(new Array(numCols).fill('W'));
  }

  // Generate 2 rooms so that they arent next to each other
  for (let n = 0; n < 2; n++) {
    let room;
    do {
      let roomWidth = floor(random(4, 8));
      let roomHeight = floor(random(4, 8));
      let roomX = floor(random(1, numCols - roomWidth - 1));
      let roomY = floor(random(1, numRows - roomHeight - 1));
  
      //creates room object
      room = {
        x: roomX,
        y: roomY,
        width: roomWidth,
        height: roomHeight
      };
    } while (!isValidRoom(room, rooms));

    rooms.push(room);
    // replace floors with .
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        grid[y][x] = '.';
      }
    }
  }

  // Connect the 2 rooms with corridors
  connectRooms(rooms[0], rooms[1], grid);

  // Place chests in rooms
  placeChests(rooms, grid);

  return grid;
}
 
//checks to see if room is overlapping or too close
function isValidRoom(newRoom, existingRooms) {
  const buffer = 3; // Minimum distance between rooms
  for (const room of existingRooms) {
    if (newRoom.x < room.x + room.width + buffer &&
        newRoom.x + newRoom.width + buffer > room.x &&
        newRoom.y < room.y + room.height + buffer &&
        newRoom.y + newRoom.height + buffer > room.y) {
      return false; 
    }
  }
  return true;
}

//connects 2 rooms 
function connectRooms(room1, room2, grid) {
  let xStart = room1.x + Math.floor(room1.width / 2);
  let yStart = room1.y + Math.floor(room1.height / 2);
  let xEnd = room2.x + Math.floor(room2.width / 2);
  let yEnd = room2.y + Math.floor(room2.height / 2);

  // Create a horizontal corridor
  for (let x = Math.min(xStart, xEnd); x <= Math.max(xStart, xEnd); x++) {
    grid[yStart][x] = '-';
  }

  // Create a vertical corridor
  for (let y = Math.min(yStart, yEnd); y <= Math.max(yStart, yEnd); y++) {
    grid[y][xEnd] = '-';
  }
}

//place chest in center of each room
function placeChests(rooms, grid) {
  rooms.forEach(room => {
    let chestX = room.x + Math.floor(room.width / 2);
    let chestY = room.y + Math.floor(room.height / 2);
    grid[chestY][chestX] = 'C';
  });
}

function drawGrid(grid) {
  // Background is typically set within draw functions in p5.js
  background(128);

  const currentTime = millis(); // Current time in milliseconds

  if (currentTime - lastToggleTime > 3000) { // Change every 3 seconds
    useAlternate = !useAlternate;
    lastToggleTime = currentTime;
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let tileType = grid[i][j];
      let tile = getTile(tileType, useAlternate); 
      placeTile(i, j, tile.x, tile.y); 
    }
  }
}
// returns the tiles based on each tile
function getTile(tileType, alternate) {
  const tiles = {
    'W': { normal: { x: 25, y: 21 }, alternate: { x:10, y: 0} },
    '.': { normal: { x: 1, y: 15 }, alternate: { x: 1, y: 1 } },
    '-': { normal: { x: 2, y: 15 }, alternate: { x: 1, y: 1 } },
    'C': { normal: { x: 2, y: 29 }, alternate: { x: 2, y: 28 } },
  };
  return alternate ? tiles[tileType].alternate : tiles[tileType].normal;
}