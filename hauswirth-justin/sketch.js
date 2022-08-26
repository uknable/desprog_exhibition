/*
A mini ray based acoustic simulation
Click anywhere on the screen to create an impulse
After 4 clicks will generate another random diffuser type
*/

let rays = []; //Empty array to hold our ray objects
let quantity = 250; //How many rays spawn on click

let font;
let textBox;
function preload(){
  font = loadFont('MomcakeBold-WyonA.otf')
}

let boxes = [];  //Empty array to hold our box / collider objects
let caseNum;
let caseText;

let count = 0; //counts how many clicks
let promptTextAlpha = 127;

function setup() {
  //createCanvas(480, 853);//Std phone screen width
  createCanvas(windowWidth, windowHeight);
  fill(220);
  
  caseNum = floor(random(3)); //Pick one of the first 3 cases randomly to start
  caseText = generateBoxes();
  
  let textBoxParameters = drawText();//Getting the information for text box from drawtext
  textBox = new ReflectBox(textBoxParameters.x, textBoxParameters.y, textBoxParameters.w, textBoxParameters.h); //create text bounding box / collider object
  
}

function draw() {
  background(0);
  drawText();
  
  
  for (let i = rays.length - 1; i >= 0; i--){ //Main loop for ray related stuff
    rays[i].move();
    rays[i].show();
    rays[i].reflect(textBox);
    
    for (let j = boxes.length -1; j >= 0; j--){
      rays[i].reflect(boxes[j]);//Needs i and j so is here rather than box loop (line 57)
    }
    
    if (rays[i].lifeSpan == 0){ //Deletes rays once they are dead
      rays.splice(i, 1);
    }
  }
  
  
  
  for (let j = boxes.length -1; j >= 0; j--){ //Main loop for box related stuff
      boxes[j].drawBox();
  }
  
  caseTextDraw(caseText); //Displays what case / diffuser design were using
  
  if (frameCount <= 256){
    promptText();
  }
  
}


function mousePressed(){ //Creates an impusle when clicked
  let angle
  
  if (rays.length <= 2000){ //limit how many rays are on screen to prevent lagging
    for (let i = 0; i < quantity; i++){ 
      angle = map(i, 0, quantity, 0, TWO_PI);
      rays.push(new Ray(mouseX, mouseY, angle)) //Spawns 'quantity' amount of rays in a circle around the mouse
     }
   
    if (count % 4 == 3){//Change to random case every 4 clicks
    caseNum++;
    caseNum = caseNum % 6;
    caseText = generateBoxes();
  }

  count++; //So first click doesnt switch case
  }
}

