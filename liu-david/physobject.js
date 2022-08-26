/*
The astronaut and planet classes inherent from PhysObject.
This class defines objects with physics collisions,
which creates emergence in the artwork. Emergence
was mentioned in a lecture.

Adapted from https://editor.p5js.org/Tony_Zhang/sketches/0qxYF-A0b
P5 did not have physics collisions built in, so I adapted Tony Zhang's
approach. This system produces realistic physics with relatively little
code.

The physics system below carries much of the sketch's emergence.
Changing something as simple as a single physObject's velocity can
drastically alter how the sketch evolves over time. The simple
laws of physics facilitate a high level of unpredictability.
This random yet realistic behaviour will hopefully evoke a sense
of awe in visitors to the website.
*/

class PhysObject {
  constructor(p, v, diameter) {
    this.p = p; // (Vector) position of the object
    this.v = v; // (Vector) velocity of the object
    /*
    All physObjects are treated as circles, when
    calculating how and if two physObjects should
    collide. this.diameter determines the size of
    this circle.
    */
    this.diameter = diameter;
    this.type = "physObject";
  }

  show() {
    // This method is overridden in child classes
  }

  move() {
    // moves the object based on it's current velocity
    this.p.add(this.v);
  }

  update(array) {
    /*
    This function processes physics collisions.
    Array should be an array of all physObjects in the sketch.

    This method cycles through array and checks if the physObject
    will collide with each entry of the array this frame.
    */

    let dir,dist;
    for (let i = 0; i < array.length; i++) {
      /*
      Dir is the direction vector from this physObject
      to another physObject in the array
      */
      dir = p5.Vector.sub(array[i].p, this.p);
      // Dist is the distance between the two physObjects
      dist = dir.mag();

      this.checkCollision(dir,dist,array[i],array);
    }
    this.walls();
  }

  walls() {
    /*
    This function makes physObjects bounce off the edges of the canvas,
    by changing their velocity
    */
    let radius = this.diameter/2;

    if (this.p.y >= height - radius || this.p.y <= radius) {
      // physObject is hitting top or bottom edge of canvas

      // correct the physObject's position
      this.p.y = constrain(this.p.y, radius, height - radius);
      /*
      We simply invert the y value of the physObject's velocity
      to simulate bouncing off a wall.
      */
      this.v.y *= -1;
    }
    if (this.p.x >= width - radius || this.p.x <= radius) {
      // physObject is hitting left or right edge of canvas

      // correct the physObject's position
      this.p.x = constrain(this.p.x, radius, width - radius);
      /*
      We simply invert the x value of the physObject's velocity
      to simulate bouncing off a wall.
      */
      this.v.x *= -1;
    }
  }

  checkCollision(dir,dist,otherObject,array){
    /*
    otherObject is the other physObject that we may collide into
    Array is an array of all physObjects in the sketch

    This function checks for and then possibly simulates a
    collision between two physicsObjects in the sketch.
    It does this by modifying both physicsObjects velocities
    using vector maths that I probably cannot explain in-depth here.

    The method returns true if a collision occured, otherwise it returns
    false.
    */

    // PhysObjects don't collide with themselves
    if (otherObject == this){return false}

    if (dist <= (this.diameter+otherObject.diameter)/2){
      /*
      The other physObject is touching or inside of
      this physObject. We process the collision.
      */
      dir.normalize();
      // Correct the physObject's positions
      this.adjust(dir, dist, otherObject);
      // Alter their velocities
      this.changeVelocities(dir, otherObject);

      if(otherObject.type =="planet"){
        otherObject.checkFracture(this);
      }

      return true;
    }
    return false;
  }

  adjust(dir, dist, otherObject) {
  // dir = Normalised vector from this object to other object
  // dist = distance to other physics object center
  // otherObject = other physObject

	let correction = ((this.diameter+otherObject.diameter)/2)-dist;
	/* If correction > 0, then this physObject overlaps another
  physObject and correction is the distance of overlap between
  the objects. The next two lines correct the positions of both
  objects, so there is no overlap
	*/
	this.p.sub(p5.Vector.mult(dir, correction));
	otherObject.p.add(p5.Vector.mult(dir, correction));
	}

  changeVelocities(dir, otherObject) {
    // dir = Normalised vector from this object to other object
    // otherObject = other physObject in collision
    /*
    This method uses vector math to change the velocities
    of two physObjects caught in a collision
    */

    /*
    v1 is the projection of this object's velocity vector onto dir
    v2 is the projection of other object's velocity vector onto dir

    See https://mathinsight.org/dot_product
    */
    let v1, v2;
    v1 = p5.Vector.dot(dir, this.v);
    v2 = p5.Vector.dot(dir, otherObject.v);

    /*
    These three lines below change the direction and magnitude of the objects' velocities
    in a realistic looking way.

    We multiply dir in the line immediately below by (v1 - v2) and add the resulting vector
    to the other object's velocity, whilst subtracting the result from our velocity.
    This would swap the two object's velocities in the case of a head-on collision.
    */
    dir.mult(v1 - v2);
    this.v.sub(dir);
    otherObject.v.add(dir);
  }
}
