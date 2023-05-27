dotArray = [];
let myFont;

// import font for text
function preload() {
  myFont = loadFont('assets/AldotheApache.ttf');
}

// add responsiveness; change number of dots depending on window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fillGrid();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER);
  noCursor();
  frameRate(15);
  colorMode(HSB);
  noStroke();
  
  // adding dot grid
  fillGrid();
}

function draw() {
  background(0, 0, 98);
  
  let mousePos = createVector(mouseX, mouseY);
  
  // drawing dot grid on each frame
  for (let i = 0; i < dotArray.length; i++) {
    let dotPos = createVector(dotArray[i].posX, dotArray[i].posY);
    if (dotPos.dist(mousePos) < 40) {  // for when dot position is within the distance of mouse position it will have larger size than normal and will gradually get smaller
      dotArray[i].mouseOverState();
      dotArray[i].displayMouseOver();
      dotArray[i].mouseOverUpdate();  // update size 
    } else {
      dotArray[i].mouseOff();
      dotArray[i].display();
      dotArray[i].updateSize();
    }
  }
  
  // creating Name object for name and shadow
  angelName = new Name();
  shadowName = new Name();
  
  // initialsiing varibales for name
  shadowName.color = color(200, 100, 100, 0.25);
  shadowName.posX = angelName.posX - 25;
  shadowName.posY = angelName.posY + 25;
  shadowName.strokeWeight = 0;
  
  // update position for parallax effect
  shadowPosX = map(mouseX, 0, width, shadowName.posX, shadowName.posX - 15);
  shadowPosY = map(mouseY, 0, height, shadowName.posY, shadowName.posY - 15);
  angelNamePosX = map(mouseX, 0, width, angelName.posX, angelName.posX + 35);
  angelNamePosY = map(mouseY, 0, height, angelName.posY, angelName.posY + 35);
  
  easingVal = 0.3   // smooth out parallax animation; 0 - 1 --> 1 is more sensitive and 0 is less sensitive
  
  shadowName.updatePos(lerp(shadowName.posX, shadowPosX, easingVal), lerp(shadowName.posY, shadowPosY, easingVal));
  angelName.updatePos(lerp(angelName.posX, angelNamePosX, easingVal), lerp(angelName.posY, angelNamePosY, easingVal));
  
  
  shadowName.display();
  angelName.display();
}

// adding dot grid
function fillGrid() {
  dotArray = [];
  xAmount = floor(width/18);
  yAmount = floor(height/18);
  for (let i = 0; i < xAmount; i++) {  // default is 40
    xPos = map(i, 0, xAmount - 1, 10, width - 10);
    for (let j = 0; j < yAmount; j++) {
      yPos = map(j, 0, yAmount - 1, 10, height - 10);
      dot = new Dot();
      dot.setPos(xPos, yPos);
      append(dotArray, dot);
    }
  }
}

// Creating dot class
class Dot {
  constructor() {
    this.color = color(random(360), 100, 100);
    this.size = floor(random(6));
    this.posX = 0;
    this.posY = 0;
    this.mouseOver = false;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.posX, this.posY, this.size);
  }

  setPos(x, y) {
    this.posX = x;
    this.posY = y;
  }

  updateSize() {  // default state for blinking effect
    if (this.size == 0) {
      if (frameCount % floor(random(20)) == 0) { // gives a random time when it starts its blinking loop
        this.size = 5;
      }
    } else {
      this.size--;
    }
  }

  mouseOverState() {  // Used when mouse hovers over the dot to make it larger
    if (this.mouseOver == false) {
      this.mouseOver = true;
      this.size = 25;
    }
  }

  displayMouseOver() {
    noStroke();
    fill(random(360), 100, 100);
    circle(this.posX, this.posY, this.size);
  }

  mouseOverUpdate() { // update size when it is in mouseOver state
    this.size = max(1, this.size - 10);
  }

  mouseOff() { // turn off mouseOver state
    this.mouseOver = false;
  }
}

// Name + shadow
class Name {
  constructor() {
    this.color = color(55, 0, 98, 1);
    this.posX = width/2;
    this.posY = height/2;
    this.strokeWeight = 2;
  }
  
  display() {
    textFont(myFont);
    textSize(width/5);
    strokeWeight(this.strokeWeight);
    stroke(0,1);
    fill(this.color);
    text('angel', this.posX, this.posY - height/7);
    text('Indrawan', this.posX, this.posY + height/7);
  }
  
  updatePos(newPosX, newPosY) {
    this.posX = newPosX;
    this.posY = newPosY;
  }
}


