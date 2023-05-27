/*
The FireTrail class is a stream of particles (ellipses), with different sizes
and colours. It is used to represent the flame of the astronaut's jetpack
and the trail of fast moving planets.

The trails visually reinforce aspects of the physics system, (like
the thrust of the astronaut's jetpack) to make the sketch appear
more eventful to users.

Inspired by //https://editor.p5js.org/cassie/sketches/HJC08Is67
*/

// MAX_POS is the maximum number of active particles in a FireTrail instance
const MAX_POS = 200;
// Opacity of trail
const opacity = 80;
// The amount of time to display a particle (in milliseconds)
let timeToLive = 400;

class FireTrail{
  constructor(sizeMultiple){
    // colours of particles
    this.colours = [color(255,100,20,opacity),color(255, 200, 10, opacity),color(255, 80, 5, opacity)];
    // sizeMultiple determines size of particles
    this.sizeMultiple = sizeMultiple;
    // smallest size a particle can be
    this.minSize = sizeMultiple*0.05;

    // x and y multipliers are used to add randomness to trail
    this.xMultiplier = sizeMultiple*0.6;
    this.yMultiplier = sizeMultiple*0.7;

    // Array of the particles in the trail
    this.particles = [];
  }

  show(xPos,yPos,append){
    push();
    /*
    All particles have a dark stroke,
    to match the  fun and cartoony aesthetic
    of the planet and astronaut sprites
    */
    stroke('rgba(0,0,0,0.29)');
    strokeWeight(2);

    if(append){
      /*
      We add a new particle at the specified
      coordinates (xPos,yPos)
      */
      this.particles.push({x: xPos,
                       y: yPos,
                      fill:random(this.colours),
                      timeLeft: timeToLive});
    }


    if (this.particles.length > MAX_POS) {
      //The array is too large
      // We remove the first (oldest) particle in the array
       this.particles.shift();
    }

    // Display all particles stored in this.particles
    let xOffset,yOffset,noiseVal,size;
    for (let i = 0; i < this.particles.length; i +=1) {
      let currentEllipse = this.particles[i];

      /*
      We offset the displayed particles' x and y positions by
      a semi-random amount every frame.
      */
      noiseVal = noise(frameCount+i);
      xOffset = map(noiseVal,0,1,-this.xMultiplier,this.xMultiplier);
      yOffset = map(noiseVal,0,1,-this.yMultiplier,this.yMultiplier);

      // We shrink particles as they get older
      size = map(currentEllipse.timeLeft,0,timeToLive,0,this.sizeMultiple);

      // Reduce the particles time to live
      currentEllipse.timeLeft -= deltaTime;
      if(currentEllipse.timeLeft <= 0 ){
        // this particle has died and is removed from the array
        this.particles.splice(i, 1);
      }

      // finally, display the particle
      fill(currentEllipse.fill);
    	ellipse(currentEllipse.x+xOffset, currentEllipse.y+yOffset, size);
    }
    pop();
  }

}
