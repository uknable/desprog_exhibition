/* waitTime controls how long the astronaut focuses on
going to a specific waypoint */
let waitTime = 10000;

class TaskGoToWaypoint extends Node {
  /*
  Task node in the behaviour tree (BT).
  Represents an action that the astronaut can take.
  In this case, the astronaut can move to a specific (x,y)
  position on the canvas (a waypoint).

  For simplicity, spawnPoints, defined in sketch.js, are used
  as an waypoints.
  */

  constructor(children) {
    super(children);
    this.astronaut = null;
    // The current waypoint's index in the spawnPoints array
    this.waypointIndex = 0;
    /*The amount of time that the astronaut has spent trying
    to move to the current waypoint*/
    this.waypointTimer = 0;
  }

  evaluate() {
    if (this.astronaut == null) {
      // assign a reference to astronaut for optimisation
      this.astronaut = this.getData("astronaut");
    }

    this.switchWaypoints();

    // move astronaut closer to waypoint
    this.astronaut.moveToPoint(spawnPoints[this.waypointIndex]);
    /* May change astronaut sprite to reflect the success
    of this task*/
    this.parent.setData("nextSpriteNum",2);
    
    this.state = nodeEnum.RUNNING;
    return this.state;
  }

  switchWaypoints() {
    this.waypointTimer += deltaTime;

    if (this.waypointTimer >= waitTime) {
      // Switch waypoint to next entry in spawnPoints array
      this.waypointTimer = 0;
      this.waypointIndex++;
      /*
      We use a modulus operation to prevent the waypointIndex
      from exceeding the size of spawnPoints
      This means that the astronaut cycles through a set of
      waypoints repeatedly
      */
      this.waypointIndex = this.waypointIndex%spawnPoints.length;
    }
  }
}
