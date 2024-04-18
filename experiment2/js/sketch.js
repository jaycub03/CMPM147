// sketch.js - purpose and description here
// Author: Jacob Ganburged
// Date: 04/15/24

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

/* exported setup, draw */

let seed = 0;
let stars = [];

const nightSkyColor0 = "#0d0f20"; //dark blue /purple top sky 
const nightSkyColor1 = "#39366f"; // blue for middle sky
const nightSkyColor2 = "#5a4975" //lighter purple for lower sky
const milkyWayColor = "#ffffff"; // white for the milky way
const horizonColor= "#0b3f72"//color for horizon
const stoneColor = "#858290";// color for stone
const grassColor = "#006400"//color for grass
const shadowhue = "#000000"//color for person

function setup() {
  canvasContainer = select('#canvas-container');
  canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent('canvas-container'); 
  initStars();

  let button = createButton('reimagine');
  button.mousePressed(reimagine);
  button.parent('canvas-container'); 
}
function windowResized() {
  resizeCanvas(canvasContainer.width,canvasContainer.height);
}

function reimagine() {
  seed++;
  redraw(); // Use redraw if you are not using a draw loop
}

function draw() {
  randomSeed(seed);

  background('#0b3f72');
  //night gradient
  for (let a = 0; a <=height; a++) {
    let gradColor;
    if(a <= (height /4)) {
    //top of sky
      gradColor = lerpColor(color(nightSkyColor0), color(nightSkyColor1), a/ (height/4));
    } else if (a <= (height / 2)) {
    //middle section of sky
      gradColor = lerpColor(color(nightSkyColor1), color(nightSkyColor2), (a - (height/4)) /(height /4));
    }else {
    //bottom section of sky
      gradColor = lerpColor(color(nightSkyColor2), color(horizonColor), (a-(height/2)) /(height /2));
    }
    stroke(gradColor);
    line(0,a,width,a);
  }
  //moving and twinkling stars
  drawStars();
  
  //drawing grass
  const grassBaseY = (height *3) /4;
  const grassHeight = height /4;
  fill(grassColor);
  rect(0,grassBaseY, width, grassHeight);
  
  //function to draw person standing on grass
  drawPerson(grassBaseY + grassHeight);
  
  fill(stoneColor); //got this from remix and kept it in but changed some of the functions
  beginShape();
  vertex(0, (height * 3) / 4); 
  const steps = 10;
  for (let a = 0; a < steps + 1; a++) {
    let x = (width * a) / steps;
    let y = (height * 3) / 4 - (random() * random() * random() * height) / 20;
    vertex(x, y);
  }
  vertex(width, (height * 3) / 4); 
  endShape(CLOSE);
}

function initStars() {
  for(let a = 0; a < 800; a++) {
    stars.push({ //sets them random
      x:random(width),
      y:random(height/2),
      size:random(1,3),
      speed:random(-0.2,0.2)
    });
  }
}
function drawStars() {
  stars.forEach(star => {
    fill(milkyWayColor); //color for stars
    noStroke();
    star.x+=star.speed;
    star.y +=random(-0.1,0.1);
    ellipse(star.x, star.y,star.size, star.size); //draw as ellipse
  })
}
// to draw person
function drawPerson(grassBaseY) {
  const personWidth = 20; //width of person
  const personHeight = 50; //height of person
  const personBottomY = grassBaseY //position for bottom for the person
    
  fill(shadowhue);
  noStroke();
  const headDiameter = personWidth;
  ellipse(40,personBottomY - personHeight - headDiameter / 2, headDiameter, headDiameter); // draw head as an ellipse
  rect(30, personBottomY- personHeight, personWidth, personHeight - headDiameter / 2); //draw body as rectangle
   
}