/*
Objects is an array of all physObjects in the sketch.
PhysObjects include planets and the astronaut
*/
let objects = [];
let spawnPoints;
let bg;// background image

function preload(){
  /*
  background image modified from
  https://www.nationalgeographic.com/adventure/article/121211-best-space-2012-endeavour-mars-rover-nasa-science
  */
  bg = loadImage("images/background.png");

  // load sprites
  preloadPlanets();
  preloadAstronaut();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  initialiseSpawnPoints();
  // Define variable for planet.js
  minDiameter = min(width, height) * 0.12;
  spawnAstronaut();
  spawnPlanets();

  /*
    We reinitialise spawnPoints, so that the array can be
    used as waypoints for the astronaut AI. See taskgotowaypoint
  */
  initialiseSpawnPoints();
}

function spawnPlanets(){
  /*
  The number of planets, their sizes and their starting
  positions differ each time the sketch is run, creatiing
  generativity
  */
  let pos, size;
  for (let i = 0; i < round(random(2,4)); i++) {
    /*
    we pop a vector form spawnPoints to use as a position.
    This ensures no planet or astronaut share the same spawn
    position, which would cause bizzare problems with the
    physics system
    */
    pos = spawnPoints.pop();
    size = min(width, height) * random(0.12, 0.17);

    // spawn in a planet with no velocity at a random position
    objects.push(new Planet(pos, createVector(), size));
  }
}

function spawnAstronaut(){
  /*
  The astronaut has a random initial position and initial velocity,
  which adds generativity.
  */
  let pos = spawnPoints.pop();
  let size = min(width, height) * 0.12;
  let vel = createVector(random(-2,2),random(-2,2));
  objects.push(new Astronaut(pos, vel, size));
}

function initialiseSpawnPoints() {
  /*
  spawnPoints is an array of vectors denoting where to spawn in
  planets and the astronaut at the start of the sketch. It
  also acts as a set of waypoints that determine how astronaut
  moves about the sketch (see taskmovetoplanet.js)

  The spawnPoints are spread across the screen to maximise usage
  of the canvas.
  */
  spawnPoints = [];
  spawnPoints.push(createVector(width * 0.15, height * 0.18));
  spawnPoints.push(createVector(width * 0.85, height * 0.2));
  spawnPoints.push(createVector(width * 0.5, height * 0.35));
  spawnPoints.push(createVector(width * 0.8, height * 0.6));
  spawnPoints.push(createVector(width * 0.51, height * 0.75));
  spawnPoints.push(createVector(width * 0.2, height * 0.7));
  shuffle(spawnPoints, true);
}

function draw() {
  // draw background
  push();
  imageMode(CORNER);
  image(bg,0,0,width,height);
  pop();

  // Process user input
  // (see planet.js)
  updateGravity();
  updateOrbit();

  /*
    Process the physics, AI and rendering of
    the planets and the astronaut
  */
  for (let i = 0; i < objects.length; i++) {
    objects[i].move();
    objects[i].update(objects);
    objects[i].show();
  }

  // fracture planets
  // (see planets.js)
  while (fracPlanets.length > 0) {
    fracPlanets.pop().fracture();
  }
}
