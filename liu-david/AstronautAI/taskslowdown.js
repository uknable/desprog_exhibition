class TaskSlowDown extends Node{
  /*
  Task node in the behaviour tree (BT).
  Represents an action that the astronaut can take.
  In this case, the astronaut tries to slow down,
  if it is moving too fast
  */
  constructor(children){
    super(children);
    this.astronaut = null;
  }

  evaluate(){
    if(this.astronaut == null){
      // assign a reference to astronaut for optimisation
      this.astronaut = this.getData("astronaut");
    }

    if((this.astronaut.v.mag() > 1.5)|| this.astronaut.wallsRisk()){
      /*
      The astronaut is moving too fast
      and/or is about to slam into a wall
      */
      this.astronaut.slowDown();
      this.state = nodeEnum.RUNNING;
      this.parent.setData("nextSpriteNum",0);
    } else{
      // astronaut does not need to slow down
      this.state = nodeEnum.FAILURE;
    }

    return this.state;
  }

}
