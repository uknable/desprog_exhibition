/*
The planet class defines a planet with its own orbit.
Being a child class of physObject, planets have collision physics.
Planets also fracture into two smaller planets under certain
conditions.

The orbit and fracture system of the planets serve to add
complexity to the physics system. These features mean that
the sketch can evolve in vastly different ways every time
it is run. This encourages users to play and discover all
the possible interactions that can occur on the canvas.
This process should evoke a sense of fun and joy.
*/

/*
grav determines the gravitional pull of all planet instances
*/
let grav = 0.03;
/*
orbit multiplier determines how large a planet's gravitional pull is
*/
let orbitMultiplier = 2;
// gravColour is the colour of a planet's orbit when it is displayed
let gravColour;

// fracLimit, minDiameter,fracPlanets are used in Planet.checkFracture
let fracLimit = 2;
let minDiameter;
let fracPlanets = [];

// Stores sprites ued to represent each planet
let planetSprites = [];

function preloadPlanets(){
  /* This function initialises astronautSprites
  and is called only in the preload function*/
  let img;
  for (let i = 1; i <4; i++){
    img = loadImage(`images/planets/asteroids-0${i}.png`);
    planetSprites.push(img);
  }
}

// USER INPUT FUNCTIONS--------------
function updateGravity(){
  /*
   This function varies the magnitude of the gravitional
   pull of every planet instance's orbit, based on the x
   position of the mouse. Gravity becomes inverted if
   the mouse is on the left of the screen.

   The magnitude of the gravity is depicted by the
   hue and saturation of every planet instances' displayed
   orbit
  */

  grav = map(mouseX,0,width,-0.1,0.1);

  let gravHue;
  if (grav >= 0){
    // orbit is blue if gravity is normal
    gravHue = 200;
  } else{
    // orbit is red if gravity is normal
    gravHue = 10;
  }
  //calculate orbit coloursaturation, based on gravity magnitude
  let sat = map(abs(grav),0,0.1,0,255);

  push();
  colorMode(HSB);
  gravColour = color(gravHue,sat,100,0.2);
  pop();
}

function updateOrbit(){
  /*
   This function expands and shrinks the size of
   every planet instance's orbit, based on the y
   position of the mouse
  */
  orbitMultiplier = map(mouseY,0,height,1,4)
}
// --------------

class Planet extends PhysObject{
  constructor(p, v, diameter){
    super(p,v,diameter);
    this.type = "planet";
    // Appearance of planets is randomised
    this.sprite = random(planetSprites);
    this.trail = new FireTrail(this.diameter*0.6);
  }

  show(){
    push();
    /*
     Display the planet's trail. If the planet isn't
     moving much, no particles will be added to the
     trail. This means that only fast moving planets
     will have a visible trail
    */
    let trailAppend = (this.v.mag()>2);
    this.trail.show(this.p.x,this.p.y,trailAppend);

    // Visualise the planet's orbit
    stroke(gravColour);
    strokeWeight(this.diameter*orbitMultiplier);
    point(this.p.x, this.p.y);

    // Display planet sprite
    image(this.sprite,this.p.x, this.p.y, this.diameter,this.diameter);
    pop();
  }

  update(array) {
    /*
      This method is identical to physObject.update,
      except for the call to this.orbit
    */
    let dir,dist;
    for (let i = 0; i < array.length; i++) {
      dir = p5.Vector.sub(array[i].p, this.p);
      dist = dir.mag();
      if (!super.checkCollision(dir,dist,array[i])){
        /*
          We only pull in other physObjects if they
          didn't collide with the planet on the same frame
          This ensures that the physics system behaves smoothly
        */
        this.orbit(dir,dist,array[i]);
      }
    }
    this.walls();
  }

  orbit(dir,dist,otherObject){
    // dir = Normalised vector from this planet to other object
    // dist = distance to other physicsobject center
    // otherObject = other physObject

    /*
    this method checks if otherObject is in range of the planet's
    orbit. If so, otherObject's velocity will be altered, to simulate
    gravity
    */

    // We ignore orbit if planet has fractured this frame
    // This prevents weird physics mistakes
    if (this.fractured){return;}

    let orbitDiameter = this.diameter*orbitMultiplier;
    if (dist <= orbitDiameter/2){
      // otherObject is inside the planet's orbit
      dir.normalize();
      /* add a vector to physObject's velocity, with
      a direction equal to the vector from otherObject to
      this planet. This makes objects in orbit turn towards
      the planet
      */
      dir.mult(-grav);
      otherObject.v.add(dir);
    }
  }

  checkFracture(otherObject){
    // otherObject = physObject that collided into this planet
    /*
    called in physObject.checkCollision

    Larger planets will fracture into smaller ones
    if they are hit by a sufficiently fast physObject
    */

    /*fracLimit is the minimum speed of otherObject,
     that could trigger a fracture*/
    let isFast = otherObject.v.mag() > fracLimit;
    // planets must be above a minimum size to fracture
    let isBig = this.diameter > minDiameter;

    if (isFast && isBig){
      /*
      This planet will fracture
      We push it into an array that processes the fracturing
      at the end of the current draw loop.
      This prevents physics mistakes
      */
      fracPlanets.push(this);
    }
  }

  fracture(){
    /*
    This method fractures the planet in half.
    This is done by shrinking the current planet to 40% of its
    original size (representing one half) and creating another identical
     instance of this smaller planet (representing the other half)
    */
    let prevDiameter = this.diameter;

    // shrink the current planet
    this.p.x -= prevDiameter/4;
    this.diameter *= 0.4;
    this.trail = new FireTrail(this.diameter*0.6);

    // copy this planet

    /*
    The clone planet is positioned slightly right of
    the original, to prevent overlapping
    */
    // create clone's positon vector
    let newPos = createVector();
    newPos.set(this.p);
    newPos.x += prevDiameter/2;

    /*
    The clone planet has the opposite velocity of
    the original, so that it appears as if the two
    fragments are being propelled outwards in
    different directions, as if the original Larger
    planet has exploded
    */
    // create clone's velocity vector
    let newVel = createVector();
    newVel.set(this.v);
    newVel.mult(-1);

    // add clone to array of all physObjects
    let clone = new Planet(newPos,newVel,this.diameter);
    objects.push(clone);
  }
}
