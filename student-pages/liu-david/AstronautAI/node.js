/*
Nodes can be in one of three states, defined by nodeEnum below.
nodeEnum is a unchangable object with three unique values.
Since javascript has no enums built in, I used the technique outlined
https://riptutorial.com/javascript/example/8706/enum-definition-using-object-freeze--
*/

const nodeEnum = {
   RUNNING: 1,
   SUCCESS: 2,
   FAILURE: 3
};
Object.freeze(nodeEnum);


class Node{
  /* This class is the basis of the  artificial intelligence (AI) system used to control
   the astronaut.
  The astronaut is controlled by a behaviour tree (BT) comprised of several connected nodes
  (see brain.js).
  The BT node system is inspired by this article:
  https://medium.com/geekculture/how-to-create-a-simple-behaviour-tree-in-unity-c-3964c84c060e
  */
  constructor(children){
    this.state = null;

    /*
    The parent node is directly connected to this node
    and is above it in the behaviour tree heirarchy
    */
    this.parent = null;
    /*
    The children nodes are directly connected to this node
    and are below it in the behaviour tree heirarchy
    */
    this.children = [];
    if (children != null){
      this.children = children;
      this.attachChildren();
    }

    /*
    Every node has a dictionary of data, that can be accessed by
    its parent nodes higher up on the BT heirarchy
    */
    this.dictionary = new p5.TypedDict();
    this.dictionary.clear();
  }

  attachChildren(){
    /*
    updates the parent value of child nodes.
    This allows, parent and child nodes to communicate
    with each other (i.e. share data and call each other's methods)
    */
    for (var child of this.children){
      child.parent = this;
    }
  }


  evaluate(){
    /*
    In the base node class, evaluate does nothing of note.
    However, in actual BT nodes, this is where the AI
    decision-making occurs. The state of a node is also
    updated here, to reflect whether a certain AI task
    succeeded, failed or is still running.

    evaluate always returns the state of the node.
    */
    return this.state;
  }

  // DICTIONARY METHODS BELOW

  setData(key, value){
    this.dictionary.set(key,value);
  }

  getData(key){
    /*
    Recursively check up the node tree for a value,
    corresponding to the dictionary key given,
    and then return that value
    */

    let value = null;

    if (this.dictionary.hasKey(key)){
      // this node's dictionary has the value and we return it
      return this.dictionary.get(key);
    } else{
      // This node does not have the value
      // We recursively check if any parents have the value
      let node = this.parent;

      while(node != null){
        // Recursive call until we reach root node of the BT
        value = node.getData(key);

        if (value != null){
          // Value was found in a parent node's dictionary
          // we return it
          return value;
        }

        // value was not found yet, so we go up another level on the BT tree
        node = node.parent;
      }
    }
    return null;
  }

  clearData(key){
    /*
    Recursively check up the node tree for a value,
    corresponding to the dictionary key given,
    and then delete that value.
    We return true if the dicitonary entry was deleted
     and false if the value was not found
    */
    if (this.dictionary.hasKey(key)){
      // this node's dictionary has the value and we delete it
      this.dictionary.remove(key);
      return true;
    } else{
      // This node does not have the key
      // We recursively check if any parents have the key
      let node = this.parent;

      while(node != null){
        // Recursive call until we reach root node of the BT
        let cleared = node.clearData(key);
        if (cleared){
          // Value was cleared from a parent node's dictionary
          return true;
        }

        // key was not found yet, so we go up another level on the BT tree
        node = node.parent;
      }
    }
    return false;
  }
}
