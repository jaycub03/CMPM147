/* exported getInspirations, initDesign, renderDesign, mutateDesign */
// I used Wes github to set up the canvas container and copied his css.
//I also copied his index.html 
//This is the link where i got the newborn photo from https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-do-i-adjust-colour-balance-without-affecting-black-white/m-p/10098155
//this is the link where I got the mlk photo from https://parade.com/260134/lindsaylowe/black-history-month-quotes/
//this is where i got the survival photo from https://webneel.com/daily/9-travel-smithsonian-photo-contest-farhana?size=_original
//inspiration photos
function getInspirations() {
  return [
    {
      name: "MLK",
      assetUrl:
        "https://cdn.glitch.global/58562f72-1f81-44ff-a07d-7e5b832fa116/mlk.webp?v=1715146399518",
      credit: "Mlk giving a speech to the people",
    },
    {
      name: "Newborn",
      assetUrl:
        "https://cdn.glitch.global/58562f72-1f81-44ff-a07d-7e5b832fa116/newborn.jpeg?v=1715146402572",
      credit: "Older generation holding the newer generation",
    },
    {
      name: "Survival",
      assetUrl:
        "https://cdn.glitch.global/58562f72-1f81-44ff-a07d-7e5b832fa116/survival.jpeg?v=1715146396640",
      credit: "Family surviving although the rough conditions",
    },
  ];
}

//on selected images it sets up the design
function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  let design = {
    bg: 128,
    fg: [],
  };
  //creates 200 random shapes
  for (let i = 0; i < 200; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 2),
      h: random(height / 2),
      fill: random(255),
    });
  }
  return design;
}

//draws the design
function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();

  //randomly draw either a ellipse or a rectangle
  for (let box of design.fg) {
    fill(box.fill, 128);
    if (random(1) > 0.5) {
      ellipse(box.x, box.y, box.w, box.h);
    } else {
      rect(box.x - box.w / 2, box.y - box.h / 2, box.w, box.h);
    }
  }
}

//mutates the design by slightly changing its properties
function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for (let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}
function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
