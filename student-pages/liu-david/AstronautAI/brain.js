class Brain{
  /*This defines the artificial intelligence (AI) driving the behaviour of
  the astronaut. AI was a topic covered in one of the lectures.
  It is based off the behaviour tree system seen in many video games
  https://youtu.be/aR6wt5BlE-E?t=96

  This code is inspired by
  https://medium.com/geekculture/how-to-create-a-simple-behaviour-tree-in-unity-c-3964c84c060e
  I chose this behaviour tree approach because it was modular (used nodes).
  It seemed like a simple way to create seemingly complex AI behaviours.

  I decided to design an AI for the astronaut to further enhance the interest
  of the sketch. The astronaut's sprites have exaggerated 'facial' expressions
  to clearly convey emotion. Behind the scenes, each sprite corresponds to a
  specific AI task. For example, the fearful looking sprite corresponds to
  the slow down task. The astronaut's mood and actions respond to the state
  of the sketch, making them feel alive. Thus, the user creates an indirect
  dialogue with the astronaut through their mouse inputs. This allows them
  to play with the AI, like a toy, and explore its behaviour. This will
  hopefully create a sense of fun within the user.
  */

  constructor(astronaut){
    this.root = null;
    this.astronaut = astronaut;
    this.setupTree(astronaut);
  }

  setupTree(astronaut){
    /*
    We create a heirarchy of nodes like this:
    level 1: Selector node (the root node)
    level 2: TaskSlowDown node, TaskMoveToPlanets node, TaskGoToWaypoint node
    All the nodes on level 2 are children of the level 1 selector node.

    This tree setup means that, every frame, the astronaut will try and slow
    down first. If it does not need to slow down, it will try to move to
    a nearby planet. If it cannot to that, it will travel towards a waypoint
    */
    this.root = new Selector([new TaskSlowDown(),new TaskMoveToPlanets(),
                             new TaskGoToWaypoint()]);

    // Pass data to the root node, so that it's children can access it
    this.root.setData("astronaut",astronaut);
    this.root.setData("nextSpriteNum",3);
    return this.root;
  }

  update(){
    // execute the AI decision making for this frame
    this.root.evaluate();

    /* Updating the astronaut's sprite depending on the task
    being executed by the AI. The astronaut has different expressions
    depending on whether it is moving towards a planet, a waypoint or
    slowing down*/
    if(frameCount%20==0){
      /*
      To prevent the astronaut from rapidly switching between frames
      (which looks jarring), we require that each sprite is displayed for
      at least 20 frames.

      Level 2 nodes (see above) may change "nextSpriteNum" in the root node's
      data dictionary. Every 20 frames, this function updates the astronaut's
      sprite using "nextSpriteNum"
      */
      let nextSpriteNum = this.root.getData("nextSpriteNum");
      // update astronaut's sprite. This may or may not change it.
      this.astronaut.spriteNum = nextSpriteNum;
    }
  }
}
