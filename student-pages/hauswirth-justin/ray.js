class Ray {
  constructor(x, y, angle){ //Ray object constructor gives rays position, vel
    this.speed = 3;
    this.pos = createVector(x, y);
    this.vel = createVector();
    //this.acc = createVector(0, 0);
    this.lifeSpan = 450; //how many frames does each ray stay onscreen for 
    
    this.vel.x =  sin(angle);
    this.vel.y = -cos(angle);
    this.vel.setMag(this.speed);

  }
  

  move() {
    
    //basic movement updating
    this.pos.add(this.vel.x, this.vel.y);
    //this.vel.add(this.acc.x, this.acc.y);
    
    
    //boundary reflections
    if (this.pos.x >= width){
      this.vel.x *= -1;
      this.pos.x = width;
    }
     if (this.pos.x <= 0){
      this.vel.x *= -1;
      this.pos.x = 0;
    }
     if (this.pos.y >= height){
      this.vel.y *= -1;
       this.pos.y = height
    }
    if (this.pos.y <= 0){
      this.vel.y *= -1;
       this.pos.y = 0
    }   
    
  }
  
  show() {
    push();
    let alfa;
    

    alfa = map(this.lifeSpan, 600, 0, 255, 0);//Alpha fadeout
    
    stroke(256, alfa) //Ray show information
    strokeWeight(4);
    point(this.pos.x, this.pos.y);  
    
    this.lifeSpan-- //lifespan reduces affecting aplha and arraylength
    pop();
  }
  
  
  reflect(box) {
    
    
    //These next if statments are awkward, logic explained below
    //Eg Case 1 detects if a ray is in the right x position and then if its y pos is in         the detection zone for the top edge.
    //DetectionZone should be at least speed otherwise particles have a chance to phase         through the wall
    //Used detection zone method as i couldn't think of another method to distuinguish       top side of box from bottom side of box
    
    let detectionZone = this.speed; //Just make the detectionZone = speed to prevent any phasing through walls 
    
    //case 1: Top of box hit
      if ((box.x <= this.pos.x && this.pos.x <= box.x + box.w) && 
          (box.y - detectionZone <= this.pos.y && this.pos.y <= box.y + detectionZone)){
        this.vel.y *= -1;
      }
    
    
    //case 2: Bottom of box hit
      if ((box.x <= this.pos.x && this.pos.x <= box.x + box.w) && 
          (box.y + box.h - detectionZone <= this.pos.y && 
           this.pos.y <= box.y + box.h + detectionZone)){
        this.vel.y *= -1;
      }
    
    
    //case 3: Left of box hit
      if ((box.y <= this.pos.y && this.pos.y <= box.y + box.h) && 
          (box.x - detectionZone <= this.pos.x && this.pos.x <= box.x + detectionZone)){
        this.vel.x *= -1;
      }
    
    
    //case4: Right of box hit
      if ((box.y <= this.pos.y && this.pos.y <= box.y + box.h) && 
          (box.x + box.w - detectionZone <= this.pos.x && this.pos.x <= box.x + box.w +             detectionZone)){
        this.vel.x *= -1;
      }
  
  }
}