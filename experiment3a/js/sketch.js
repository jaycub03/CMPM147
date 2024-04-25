// project.js - dungeon/overworld
// Author: Jacob ganburged
// Date: 4/24/24

/* exported generateGrid, drawGrid */
/* global placeTile*/

let lastToggleTime = 0;
let isWinter = true;

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols).fill("_"); 
  }

  // Place house in clusters
  let houseClusters = placeClusters(grid, numCols, numRows, 'H', 3); // 3 clusters of houses

  //path for houses
  createPathsBetweenHouses(grid, houseClusters, 'P', numCols, numRows);

  // Place trees around clusters, ensuring they don't overlap the paths
  houseClusters.forEach(cluster => {
    placeTreesAroundCluster(grid, cluster, 'T', 1, numCols, numRows); 
  });

  return grid;
}

//randomly place clusters on grid making sure they dont overlap
function placeClusters(grid, numCols, numRows, tileType, clusterCount) {
  let clusters = [];
  for (let n = 0; n < clusterCount; n++) {
    let clusterX, clusterY;
    do {
      clusterX = floor(random(1, numCols - 1));
      clusterY = floor(random(1, numRows - 1));
    } while (grid[clusterY][clusterX] !== '_'); 
    clusters.push({ x: clusterX, y: clusterY });
    grid[clusterY][clusterX] = tileType;
  }
  return clusters;
}

//connect clusters with the houses
function createPathsBetweenHouses(grid, houseLocations, pathTileType) {
  //loop through each pair of houses and draw path
  houseLocations.forEach((start, idx) => {
    if (idx < houseLocations.length - 1) {
      let end = houseLocations[idx + 1];
      // horizontal path
      for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x); x++) {
        if (grid[start.y][x] === '_') {
          grid[start.y][x] = pathTileType;
        }
      }
      // vertical path
      for (let y = Math.min(start.y, end.y); y <= Math.max(start.y, end.y); y++) {
        if (grid[y][end.x] === '_') {
          grid[y][end.x] = pathTileType;
        }
      }
    }
  });
}

//places trees around the cluster
function placeTreesAroundCluster(grid, cluster, tileType, thickness) {
  let startX = cluster.x - thickness;
  let endX = cluster.x + thickness;
  let startY = cluster.y - thickness;
  let endY = cluster.y + thickness;
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && grid[y][x] === '_') {
        grid[y][x] = tileType;
      }
    }
  }
}

//siwtches between winter and desert 
function getTile(tileType, isWinter) {
  const tiles = {
    '_': { // Ground
      winter: { x: 1, y: 12 },
      desert: { x: 2, y: 3 }
    },
    'H': { // Houses
      winter: { x: 27, y: 3 },
      desert: { x: 26, y: 1 }
    },
    'T': { // Trees
      winter: { x: 18, y: 13 },
      desert: { x: 18, y: 4 }
    },
    'P': { // Paths
      winter: { x: 3, y: 13 },
      desert: { x: 1, y: 4 }
    }
  };

  // Select the appropriate tile based on winter or desert
  let theme = isWinter ? 'winter' : 'desert';
  return tiles[tileType][theme];
}

//draws the grid  and uses millis to switch from winter to desert every 5 seconds
function drawGrid(grid) {
  const currentTime = millis();
  if (currentTime - lastToggleTime > 5000) {
    isWinter = !isWinter;
    lastToggleTime = currentTime;
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let tile = getTile(grid[i][j], isWinter); //gets appropiate tile for each cell (H,_,T,P)
      placeTile(i, j, tile.x, tile.y);
    }
  }
}
