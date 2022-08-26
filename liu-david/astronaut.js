/*Astronaut uses a jetpack to propel itself
The jetpack can only be used for a limited amount of time,
before it 'overheats'.
This amount of time is determined by maxThrustTime.
Once it 'overheats', the jetpack cannot be used for a set amount of time,
specified by maxCooldownTime.
After this 'cooldown' time has elapsed the jetpack can be used again,
for a limited amount of time before it overheats.
The process then repeats itself.
*/
let maxCooldownTime = 1000;//time in milliseconds
let maxThrustTime = 1000;//time in milliseconds

/* thrustMag controls the degree to which the astronaut's jetpack
thrust changes its velocity on a certain frame */
let thrustMag = 0.05;

// astronautSprites is an array that stores images used to represent the astronaut
let astronautSprites = [];

function preloadAstronaut(){
  /* This function initialises astronautSprites
  and is called only in the preload function*/
  let img;
  for (let i = 1; i <4; i++){
    img = loadImage(`images/astronaut/astronaut-0${i}.png`);
    astronautSprites.push(img);
  }
}

class Astronaut extends PhysObject{
 constructor(p, v, size){
   super(p, v, size);
   this.type = "astronaut";
   this.brain = new Brain(this);
   this.trail = new FireTrail(this.diameter*0.7);

   //JETPACK ATTRIBUTES
   //availableThrust is the amount of jetpack thrust time left before it overheats
   this.availableThrust = maxThrustTime;
   /*coolDownTimer counts down whilst the jetpack is overheated,
   to track the time remaining until the jetpack becomes usable again
   If it is 0, the jetpack is not currently overheated*/
   this.coolDownTimer = 0;
   // hasBoosted is true if the boost method was called during a frame
   this.hasBoosted = false;
   // index of the sprite to display from astronautSprites
   this.spriteNum = 0;
   /* Size of displayed sprite.
   This is bigger than the diameter, which is used for physics calculations,
   to enhance the astronaut's visibility on screen
   */
   this.spriteSize = this.diameter*1.3;

   // AI ATTRIBUTES
   // these variables are used by the AI FUNCTIONS below

   // Used in this.moveToPoint
   this.closeDist = 0.35 * min(width, height);
   // A nearby planet that the astronaut is currently moving towards
   this.targetPlanet = null;
   // Used in this.updateTarget
   this.visionDistance = 3*size;
 }

  show(){
    // Display firetrail then astronaut onto the canvas
    /* firetrail will decrease in visual intensity if we
    have not used the jetpack's thrust this frame (see firetrail.js)*/
    this.trail.show(this.p.x,this.p.y+this.spriteSize*0.25,this.hasBoosted);
    let sprite = astronautSprites[this.spriteNum];
    image(sprite,this.p.x,this.p.y, this.spriteSize, this.spriteSize);
  }

  update(array){
    this.updateJetpack();

    //AI processing
    this.brain.update();

    // Physics processing
    super.update(array);
  }

  updateJetpack(){
    //jetpack processing
    if (this.availableThrust <= 0){
      // We are out of thrust time
      // cooldownTimer counts down until it reaches 0
      this.coolDownTimer -= deltaTime;
       if (this.coolDownTimer <= 0){
         /* The jetpack becomes usable again and
         availableThrust is reset*/
         this.availableThrust = maxThrustTime;
       }
    }
    /* hasBoosted is reset every frame
    and set to true if this.boost is called by
     the astronaut's brain (AI) this frame*/
    this.hasBoosted = false;
  }

  checkCollision(dir,dist,otherObject,array){
    /*
    CheckCollision is called in a for loop in the base
    class PhysObject. We override checkCollision to see if any planets are near our astronaut
    using this.updateTarget. We do this in checkCollision to avoid having to create another for
    loop to cycle through all the planets again, for optimization reasons.
    */
    if (otherObject == this){return false}
    // we only check if we don't already have a planet we are moving towards
    if (this.targetPlanet ==null){this.updateTarget(dist,otherObject)}
    super.checkCollision(dir,dist,otherObject,array);
  }

  updateTarget(dist,planet){
    /* Check if planet is close enough for us to move towards.
    The maximum distance of the planet is determined by
    this.visionDistance*/
    // dist is the distance to the planet
    // planet is reference to the planet
    if (dist <= this.visionDistance){
      this.targetPlanet = planet;
    }
  }

  // AI METHODS
  /* These methods below are only called by the AI behaviour tree nodes,
  defined in the files of AstronautAI folder*/

  slowDown(){
    /*If the astronaut's velocity is too fast, this function is called to
    slow it down. It boosts the astronaut in the exact opposite direction
    to its current direction of travel*/
    let dir = createVector(-this.v.x,-this.v.y);
    this.boost(dir,1);
  }

  moveToPoint(point){
    // point is a 2 dimensional vector
    /*moves the astronaut to a specific point*/

    // dist represents distance to the point
    let dist = p5.Vector.dist(point, this.p);
    // dir represents direction to point from astronaut
    let dir = p5.Vector.sub(point, this.p);

    /*To effectively move to a point, this function has two outcomes:
    If the astronaut is far from a point we change it's velocity more drastically
    If the astronaut is close to a point, we change it's velocity with increasing
    subtlety
    this.closeDist determines if the astornaut is close or far*/
    if (dist > this.closeDist) {
      this.boost(dir,0.4);
    } else {
      /*The magnitude (power) of the boost decreases
      as we move closer to the point*/
      let mag = map(dist, 0, this.closeDist, 0, 0.4);
      this.boost(dir, mag);
    }
  }

  boost(dir, magnitude){
    // dir is a 2 dimensional vector, indicating direction of boost
    //magnitude is a float, indicating intensity of boost
    /*Affects astronaut velocity, making it move slightly more in a specific direction
    In game, this represents the thrust of the astronaut's jetpack*/

    // We contrain magnitude because we don't want it to thrust too much
    magnitude = constrain(magnitude,0,1);

    if (this.availableThrust > 0) {

      // We have enough thrust time to boost
      this.availableThrust -= deltaTime;

      // add a vector, based on parameters, to astronaut's velocity
      dir.normalize();
      dir.mult(thrustMag*magnitude);
      this.v.add(dir);

      this.hasBoosted = true;
      if (this.availableThrust <= 0){
        /*We have run out of thrust time
        and have to wait until jetpack becomes usable again.
        See this.updateJetpack()*/
        this.coolDownTimer = maxCooldownTime;
      }
    }
  }

  verifyTarget(){
    /*returns true if there is a planet near our
    astronaut. Otherwise it returns false*/
    if(this.targetPlanet == null){return false}

    let dist = p5.Vector.dist(this.targetPlanet.p, this.p);
    if(dist > this.visionDistance){
      // target planet is too far away
      // and we must reset this.targetPlanet
      this.targetPlanet = null;
      return false;
    }
    return true;
  }

  wallsRisk(){
    /*returns true if astronaut is headed towards the edge of the Canvas
    at a high enough velocity. This is called to regulate
    the astronaut's speed and prevent it from clumsily slamming into the
     edge of the screen*/

    // margin determines if astronaut is sufficiently close to an edge
    let margin = 0.3*min(width,height);
    if (this.p.x < margin && this.v.x <-0.5){
      // about to hit left edge/wall
      return true;
    }
    if (this.p.x > width-margin && this.v.x > 0.5){
      // about to hit right edge/wall
      return true;
    }
    if (this.p.y < margin && this.v.y <-0.5){
      // about to hit top edge/wall
      return true;
    }
    if (this.p.y > height-margin && this.v.y > 0.5){
      // about to hit bottom edge/wall
      return true;
    }
    return false;
  }
}
