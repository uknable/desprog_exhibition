//create an array of particles
let particle=[];
// the size of  'invisible' fan
let rFan =40;

let colourVirus;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //use for loop to create 300 particle that random on the full canvas
  //because particle=[];, so i use push to push particle array

  loadParticles();
}


function loadParticles() {
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    let col = color(100, 100, 100, 60);//make the colour grey before movinf mouse
    particle[i]=new Particle(x, y, col);
  }
}

//when I start to move my mouse, the colour will start to apply, and evey movement of mouse will change the colour of particles
function mouseMoved() {
  for (let i = 0; i < 500; i++) {
    particle[i].changeColor();
  }
}


function draw() {
  //use alpha to create more force animation feeling
  background(0, 20);  
  angleMode(DEGREES);

  //run move() and display() from class;
  for (let i = 0; i < 500; i++) {

    //use mouseX,Y to control the movement of particles which can based on mouse
    particle[i].move(mouseX, mouseY); 
    particle[i].display();
  }

  //I prefer to use customized function to create an 'invisible' fan in which all the particles escape away from it
  fan(rFan);
}


// use windowResized to load particles everytime when you change the window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  
  loadParticles();
}

// a customized function that create an 'invisible' fan, I want to use line and createVector() to create an dynamic shape which similar to fan
function fan(r) {
  angleMode(DEGREES);

  //make sure the 'invisible' fan follow by mouse so that all the particles will force away from fan
  translate(mouseX, mouseY);

  for (let i = 0; i <= 360; i += 17) {


    let speedX = sin(i)*r;
    let speedY = cos(i)*r;

    //copy from p5.js createVector() reference library  https://p5js.org/reference/#/p5/createVector
    let v = createVector(speedX, speedY);

    //make the lines will in different length
    v.mult(random(1, 2));


    strokeWeight(5);

    //the 'invisible' fan will show up only when people press there mouse
    if (mouseIsPressed) {
      // this range of  colour are purple,green,blue 
      colourVirus = color(random(100), random(100), random(255), 100);
      stroke(colourVirus);
    } 
    line(0, 0, v.x, v.y);
  }
}

// a class of particles
class Particle {
  constructor(x, y, col) {

    this.x =x;
    this.y =y;

    this.col =col;

    //awayXY are the distance that  
    this.awayX =x;
    this.awayY =y;
  }

  //when mouse moved, the colour will change
  //I choose to use this range of random colour because i believe it are like light spot on stage. I also add alhpa to make them more like spots 
  changeColor() {
    this.col=(color(random(200), random(100), 100, random(60, 200)));
  }


  //the force movement that when mouse close to particle
  //mx and my are mouseX,Y, so particles will move based on mouse
  move(mx, my) {

    //mouse control cite from [Week 9: Extension Challenge 04]https://canvas.sydney.edu.au/courses/40098/pages/week-9-extension-challenge-eye-extension?module_item_id=1454206
    let angle = atan2(this.y - my, this.x - mx);
    let dis = dist(this.x, this.y, mx, my);

    //away control change from [Week 9: Extension Challenge 04]https://canvas.sydney.edu.au/courses/40098/pages/week-9-extension-challenge-eye-extension?module_item_id=1454206
    let awayAngle = atan2(this.awayY -this.y, this.awayX -this.x);
    let awayDis = dist(this.x, this.y, this.awayX, this.awayY);

    //force control
    // use map to control the force amount
    let force = constrain(map(dis, 0, 100, 50, 0), 0, 100);
    let awayForce =map(awayDis, 0, 100, 0, 10);

    //assign forces
    //i want all the particles can spread with the mouse as the center, so i use cos(angle)*r and sin(angle)*r
    let speedX = cos(angle) * force;
    speedX += cos(awayAngle) * awayForce;

    let speedY = sin(angle) * force;
    speedY += sin(awayAngle) * awayForce;

    //add forces into x and y
    //use random(-2,2) to create flutter
    this.x += speedX + random(-1, 1);
    this.y += speedY + random(-1, 1);
  }

  //show the particles as ellipses
  display() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, 17);
  }
}