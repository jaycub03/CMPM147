// project.js - a script that generates a random rave story
// Author: Jacob Ganburged
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

const fillers = {
  raves: ["edc", "beyond wonderland", "lost lands", "illenium", "seven lions", " slander", "escape", "jason ross"],
  activity: ["drink", "smoke", "nothing and stay sober"],
  car: ["BMW", "Mercedes", "Audi", "Toyota", "Honda"],
  plur: ["shoulder ride", "headbang", "moshpit"],
  food:["wingstop", "mcdonalds", "thai food", "korean food"]
  
};

const template = 'You are a fellow raver and you have just heard from a friend that there is going to be an exciting rave on the weekend and $raves is playing. You guys arrive with your $car and park at the parking lot. You guys decide to pregame and you decide to do $activity. You guys are having a blast and a random person in the crowd comes to you and asks if you want to $plur. You tell them yes and you guys have the best night of your lives and after the rave has finished you and your friends decide you want to eat somewhere and decide on $food. After you guys eat everyone goes home and waits for the next rave or festival to happen.'

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);

}

/* global clicker */
$("#clicker").click(generate);

generate();
