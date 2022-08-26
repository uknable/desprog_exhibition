class Selector extends Node{
  /* This class is a special type of node that behaves like an OR logic gate
  The code is inspired by this article:
  https://medium.com/geekculture/how-to-create-a-simple-behaviour-tree-in-unity-c-3964c84c060e
  */
  evaluate()
  {
    /*
    This node evaluates its children one by one,
    from the  start of its children array to the end.
    If a child node returns a RUNNING or SUCCESS state,
    it will not evaluate any other nodes and return.

    In practice, this means that, every frame, the AI attempts to do a list
    of tasks. If it succeeds at a task, then it will not attempt
    to do any other tasks (at least not until the next frame)
    */
    for (var child of this.children)
    {
      switch(child.evaluate())
        {
        case nodeEnum.FAILURE:
          continue;
        case nodeEnum.SUCCESS:
          this.state = nodeEnum.SUCCESS;
          return this.state;
        case nodeEnum.RUNNING:
          this.state = nodeEnum.RUNNING;
          return this.state;
        default:
          continue;
        }
    }
    this.state = nodeEnum.FAILURE;
    return this.state;
  }
}
