class TaskMoveToPlanets extends Node {
  /*
  Task node in the behaviour tree (BT).
  Represents an action that the astronaut can take.
  In this case, the astronaut can move to a nearby planet
  A reference to the planet is stored in the astronaut's
  targetPlanet attribute
  */
  constructor(children) {
    super(children);
    this.astronaut = null;
  }

  evaluate(){
    if(this.astronaut == null){
      // assign a reference to astronaut for optimisation
      this.astronaut =this.getData("astronaut");
    }

    if (!this.astronaut.verifyTarget()){
      // There is no planet nearby
      this.state = nodeEnum.FAILURE;
    }else{
      // There is a planet nearby
      // move to it
      let planetPos = this.astronaut.targetPlanet.p;
      this.astronaut.moveToPoint(planetPos);

      /*May change astronaut sprite to reflect the success
      of this task*/
      this.parent.setData("nextSpriteNum",1);

      this.state = nodeEnum.RUNNING;
    }
    return this.state;
  }
}
