const mySketch = (sketch) => {
  let worldSeed;
  let selectedTiles = {};
  let tileWidth = 32;
  let tileHeight = 16;
  let tileColumns, tileRows;
  let cameraOffset;
  let cameraVelocity;

  sketch.preload = function() {
      // Add preload code here if necessary
  };

  sketch.setup = function() {
      sketch.createCanvas(800, 400).parent("container");
      cameraOffset = new sketch.createVector(-sketch.width / 2, sketch.height / 2);
      cameraVelocity = new sketch.createVector(0, 0);

      setupWorld("xyzzy");  // Setup with default key
  };

  function setupWorld(key) {
      worldSeed = sketch.XXH.h32(key, 0).toNumber();
      sketch.noiseSeed(worldSeed);
      sketch.randomSeed(worldSeed);
      calculateTileDimensions();
  }

  function calculateTileDimensions() {
      tileColumns = Math.ceil(sketch.width / tileWidth);
      tileRows = Math.ceil(sketch.height / tileHeight);
  }

  sketch.draw = function() {
      sketch.background(100);
      updateCamera();
      drawTiles();
  };

  function updateCamera() {
      if (sketch.keyIsDown(sketch.LEFT_ARROW)) cameraOffset.x += 5;
      if (sketch.keyIsDown(sketch.RIGHT_ARROW)) cameraOffset.x -= 5;
      if (sketch.keyIsDown(sketch.UP_ARROW)) cameraOffset.y += 5;
      if (sketch.keyIsDown(sketch.DOWN_ARROW)) cameraOffset.y -= 5;
  }

  function drawTiles() {
      for (let i = 0; i < tileColumns; i++) {
          for (let j = 0; j < tileRows; j++) {
              let x = i * tileWidth + cameraOffset.x;
              let y = j * tileHeight + cameraOffset.y;
              drawTile(i, j, x, y);
          }
      }
  }

  function drawTile(col, row, x, y) {
      let noiseVal = sketch.noise(col / 10.0, row / 10.0);
      if (selectedTiles[`${col},${row}`]) {
          sketch.fill(135, 206, 235);
      } else if (noiseVal < 0.3) {
          sketch.fill(240, 248, 255);
      } else if (noiseVal < 0.6) {
          sketch.fill(176, 224, 230);
      } else {
          sketch.fill(205, 133, 63);
      }
      sketch.rect(x, y, tileWidth, tileHeight);
  }

  sketch.mouseClicked = function() {
      let col = Math.floor((sketch.mouseX - cameraOffset.x) / tileWidth);
      let row = Math.floor((sketch.mouseY - cameraOffset.y) / tileHeight);
      toggleTile(col, row);
  };

  function toggleTile(col, row) {
      let key = `${col},${row}`;
      if (selectedTiles[key]) {
          delete selectedTiles[key];
      } else {
          selectedTiles[key] = true;
      }
  };

  function worldToScreen(x, y) {
      return [(x - y) * tileWidth / 2 + cameraOffset.x, (x + y) * tileHeight / 2 + cameraOffset.y];
  }

  function screenToWorld(sx, sy) {
      let x = (sx - cameraOffset.x) / (tileWidth / 2);
      let y = (sy - cameraOffset.y) / (tileHeight / 2);
      return [(y + x) / 2, (y - x) / 2];
  }
};

new p5(mySketch, 'container');
