//I set the variables I need before all the functions start running.
//The variables set in the global scope will be used by me in all the following code. They may be assigned different values ​​in the local position to ensure that the mathematical formulas that do not understand the operation of each functional area work properly.

//I name the photos I import. Since the whole image is the main element of the avatar, I named it head_img
let head_img;

//Since I later applied the padding of all the pixels of the photo, I set variables here in preparation for defining the X and Y coordinates of each pixel later.
let waterX
let waterY

//In my idea, I didn't want to set each pixel directly as a circle, so I set a pattern of water droplets in post to be used as an element for each pixel. And the variable here is to define the width of the droplet.
let waterW

//It turned out that I wanted to use "mask" directly to imitate the effect of a flashlight, but since p5js could not carry it and crashed many times, I changed my thinking here and defined this variable to serve the post-production "mask" effect.
let circleR = 1000

//Since I set the interactive form of mouse clicks in the following code, the variables here are to show the effect of wave fluctuations after mouse clicks.
let curveDisplay = false

//After talking to the instructor, I understood that just one image wouldn't fit in any preview window, so I added a river-like particle element around it. Here, I set up the array "particle" in preparation for filling the variable later.
let particles = [];

//To separate the two different canvases, I will add river-like particles around the photo, echoing the theme of the entire loading page.
let pg; // Canvas to store pictures

//Define the coordinate position of the image.
let imgLocationX = 200, imgLocationY = 400

//Preparing for adding the word "loading" later
let loading;

//I import the pictures I need into p5js, and I want to make different special effects for my pictures by generating art.
function preload() {
	head_img = loadImage('assets/water.jpg')
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	textAlign(CENTER);
	angleMode(DEGREES);
  //frameRate(10)
  
  
//Define my photo to create a graphic across the canvas, which allows me to add the desired effect around the picture. And they don't affect each other.
	pg = createGraphics(300, 300);
  
	//I define the coordinate point of the picture in the center of the picture, in order to be able to plan the position of the picture more accurately.
	pg.imageMode(CENTER);
	pg.noStroke();
	pg.frameRate(30)
  
  //The position defined here is to define the entire picture in the middle of the entire window.
	imgLocationX = width / 2 - pg.width / 2
	imgLocationY = height / 2 - pg.height / 2
  
  //Create a new object here in preparation for the subsequent generation of the word "loading..."
  loading = new Loading();
  
   push() 
  fill(255,255,255,100)
  //The text included here is to guide the user through the interaction with the interface.
		textSize(10)
		textStyle(BOLD)
		text("Swipe the mouse\nor tap the screen for interaction\nClick on the picture \nand anywhere on the screen \nto achieve different effects",width/10 *8.5,height/10*8.5)
  pop()

  
  
}
/////////////////////////////////////////////////////////////
function draw() {
	// loop through all particles in the particles array
	for (let i = 0; i < particles.length; i++) {
      
      
  //Populate the array here, define its generation and update, in preparation for the effect to be rendered later.
		particles[i].draw();
		particles[i].update();
      
  //When the radius of each small particle is less than 0, then it will meet the "if" condition and will delete a particle from the i-th, and the effect of the picture feedback is that when the particle is very small, it seems to disappear .
		if (particles[i].radius <= 0) {
			particles.splice(i, 1); // Delete elements from the particles array, starting from the i-th, delete one. Deleting it is to ensure the speed of operation, so that it will not cause serious computer freezes due to storing too many arrays.
		}
	}
//In the scope of "draw", define all custom functions, which can ensure that all custom functions can run normally.
	loading.display()

	drawPic()
	mask()
	image(pg, imgLocationX, imgLocationY, pg.width, pg.height);
}

////////////////////////////////////////////////////////////////////////
class Loading {
	constructor() {
      
  //This is where I start to define where and how big the word "loading" will appear, and the angle at which it will start rotating
		this.x = width / 2
		this.y = height / 2
		this.a = 0
		this.size = 300
	}

	display() {
		push()
      
  //When I started the demo, I rotated each line, they would rotate according to their own coordinates, and the effect would be like a giant roulette, simulating a loading interface.
		translate(this.x, this.y)
    //gradually increase the angle
		this.a += 5
      //Rotate with increasing angle
		rotate(this.a)
      //Fill each line with color and add transparency to make the entire roulette look more vivid.
		stroke(255, 255, 255, 60)
		strokeWeight(2)
		line(this.size, 0, this.size + 50, 0)
		textAlign(CENTER)
		pop()

		fill(255)
		textSize(30)
      //Make the word "loading" appear below the image
		text('Loading...', width / 2, height / 2 + pg.height / 2 + 50)
	}
}

//I store all the codes and formulas about the changes of the picture drops and water splashes in my custom function "drawPic", which can ensure that the picture and the surrounding rivers will not interfere with each other.
function drawPic() {
	pg.background(0);
  
  
/////I set a variable "waterX" here, which will represent the number of water droplets arranged in the horizontal row, and set it to mouseX so that users can use the mouse to interact with the picture. The specific "mouseX/8" is the result of multiple digital transformations and attempts.
  
  //Similarly, the "waterY" variable is used to define the number of water droplets in each column of the sequence. Since the image is close to a square, set "waterX=waterY".
	waterX = mouseX / 8;//Number of droplet layouts
	waterY = waterX
  
// //After setting the number of layouts, I set "waterW" and "waterY" here, which are used to define the width and height of the water droplets in each pixel. The use of "pg.width/waterX" and "pg.height/waterY" is to make the width, height and area of ​​each water droplet equal, so that the picture is more standardized, and there will be no too large or too small water droplets.
	waterW = pg.width / waterX; 
	let waterH = pg.height / waterY;

  //The "for loops" loop helps me to loop on the x-axis and y-axis separately, making each coordinate point add the same value
	for (let x = 0; x < waterX; x += 3) {
		for (let y = 0; y < waterY; y += 3) { 
          
          //Set the "int" function to ensure that the resulting value is an integer, and also to make the distribution of each drop or spray under the same standard.
			let pX = int(x * waterW)
			let pY = int(y * waterH)
            
			//In this step, I set the variable "c", which will be used for the pixel filling of all the water drop elements and spray elements later.
			//And I combine the variable "c" with the original picture color. In this way, each filled pixel in post-production will be derived from the color of the original image.
			// It helps me that after the final mouse drag, the water droplets will make up the complete picture. The picture composed of water drop elements will be very similar to the overall picture.
			let c = head_img.get(pX, pY) // pixel color
			//fill pixel
			pg.fill(c)
          
			//The reason for setting "if" here is to determine whether the mouse click is "true" or "false". This will help me achieve the transition of elements between spray and water droplets.          
			if (curveDisplay) {
              
				//I define the coordinates of all the waves I draw as the x and y coordinates in the for loop. When they are multiplied by the width and height, the result is the area and coordinates of the location of each wave.
              curveShape(pX, pY, c)
			} else {
              
				//Similarly, I define the coordinates of all the water droplets I draw as the x and y coordinates in the for loop. When they are multiplied by the width and height, the result is the area and coordinates of the location of each water droplet.
				waterDrop(pX, pY)
			}

		}
	}
}

////////////////////////////////////////////////////////////////////////////////////
//Set a function to switch the mode of a mouse click
function mouseClicked() {
// Here, I've defined that the mouse click transition only happens inside the image. When the mouse click position occurs within the picture area, the change of water droplets and water splashes between pixels will only occur.
	if (mouseX >= imgLocationX && mouseX <= imgLocationX + pg.width && mouseY >= imgLocationY && mouseY <= imgLocationY + pg.height) {
      
		// When the mouse is clicked in the corresponding area, "curveDisplay" will be changed to "ture", then the whole picture will be switched from water droplets to spray mode. And when the mouse is clicked again, "curveDisplay" will be equal to "false" again, then the image will return to the mode of water droplets filling the pixels.
		curveDisplay = !curveDisplay
	} else {// And if the mouse click position is outside the picture, the effect will be the spreading river.
      
//With each mouse click, 30 loops, or 30 particles, will be added to the array. This section will control the size of the river area generated with each mouse click.
		for (let i = 0; i < 30; i++) {
			particles.push(new Particle(mouseX, mouseY));
		}
	}

}
////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
//make waves
function curveShape(Xpos, Ypos, c) {
	pg.push()
	// What I've found by experimenting is that if the transformation to the entire canvas is not used, the generated spray coordinates will converge at (0, 0). And when I "translate" the canvas, the coordinates of each wave will correspond to each set pixel position. The "translate" here will help the waves line up regularly across the canvas.
	pg.translate(Xpos, Ypos);
	pg.noFill();
  
	//Setting a random variable here is to make the waves I set look fluctuating.
	pg.strokeWeight(random(30));

	//I use the color RGB value of each pixel of the photo to fill each wave. When the mouse is scrolled to (width, height), all the waves are filled according to the original color of the photo.
	pg.stroke(color(c));

	//The "curve" curve function here is used to draw the small wave shape of each spray in a curved manner. The value of the trigonometric function is also used. The radian value of the entire wave is referenced from https://youtu.be/me04ZrTJqWA
	pg.curve(Xpos, Ypos, sin(Xpos) * 20, cos(Xpos) * sin(Xpos) * 40, 0, 0, cos(Ypos) * sin(Xpos) * random(140), cos(Xpos) * sin(Xpos) * 150)

	// "pop" will terminate the entire "translate" process. It ensures that the padding of the spray pixels is where I want them to be.
	pg.pop()
}
/////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
//make a mask
function mask() {
	//In the follow-up process, I will create a mask for the existing screen. However, since the process of making the mask is to create the canvas again in p5js, and then use "mask.erase" to erase the existing "mask.ellipse". This is why p5js is too computationally intensive, causing it to crash.

	// I changed my mind and drew a black circle with a border in the global scope, and the border thickness was defined as 1000, and occluded the entire canvas.
	pg.fill(0, 0, 0, 0)
	pg.strokeWeight(circleR)
	pg.stroke(0)


	//Set the radius of the center of the circle. When I draw the "map", I use mouseY as a control variable, which allows me to control the display area of ​​the underlying effect by sliding the mouse up and down.
	let r = circleR + map(mouseY, 0, height, 0, circleR)
    
    //place mask
	pg.circle(pg.width / 2, pg.height / 2, r)
}
////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////
//make water droplets
function waterDrop(x, y) {
	//Set a facter variable and combine it with the map function.
	//Set a minimum value to ensure that the water droplets can change regularly in the form of a map under the control range of my mouse.
	//The zoom ratio of the overall water drop is controlled by mouseX, which will double from 0.09 times as the mouse is swiped to the left. That is to say, when the mouse is at the far right of the entire canvas, the proportion of water droplets will be 0.09 times the original.
	//And this value is obtained by me through repeated attempts and repeated adjustments.
	let factor = map(min(mouseX, width), width, 0, 0.09, 1) 

	pg.push()
	pg.noStroke()
	//Similar to the spray painting operation, when I "translate" the canvas, the coordinate point of each water droplet will correspond to each set pixel position. The "translate" here will help the droplets to line up regularly across the canvas.
	pg.translate(x, y)

	//scale is used to control the size of the glob, it will change as the facter changes, in other words, the scale will have mouseX control, move on the canvas x coordinate, and control the size of the glob element.
	pg.scale(factor)
	pg.beginShape()
	let X1 = x
	let Y1 = y
    
	//When starting to paint globs with curves, I need to set a starting point first. The coordinates of this starting point correspond to the vertex coordinates of all water droplets in each row and column.
	pg.vertex(X1, Y1);

	//The following curve values ​​are the results I got through repeated trial and error. The water drop presented by the curve is a very smooth symmetrical figure.
	pg.bezierVertex(X1 + 20, Y1 + 20, X1 + 40, Y1 + 55, X1, Y1 + 60);
	pg.bezierVertex(X1 - 40, Y1 + 55, X1 - 20, Y1 + 20, X1, Y1);
	pg.endShape();
	pg.pop()
}
/////////////////////////////////////////////////////////////

//make rivers
//The following code is referenced from https://openprocessing.org/sketch/143842
class Particle {


	constructor(mX, mY) {
      
      //define the current position of each particle
		this.location = createVector(mX, mY); 
      
      //The radius of each particle will take any value between 0 and 0.03
		this.radius = random(0.03);
      
  //Setting the color and adding an array with "random" allows the computer to freely choose the colors stored in the array, and the generated rivers are no longer a single color, they have certain changes.
		this.c = color(random(['skyblue','rgb(163,162,245)','rgb(184,247,252)']));

  //Set the initial coordinates of the particle x and y axes to prepare for the effect of the river spreading later
		this.xOff = 0
		this.yOff = 0
	}

	update() {
  //As each particle is updated, their radius will slowly decrease until they are removed.
		this.radius -= random(0.0001); // The radius is getting smaller and smaller
//Start setting the river direction for the x-axis. "random" is used so that the flow direction of the river is not only positive, it can also be negative, so that the x-coordinate of the river will move in different directions.
		this.xOff += random(-0.5, 0.5);
      
  //Added "noise" function, so that the effect of the river spread card will be smooth and more similar to the real river satellite image.
		this.nX = noise(this.location.x) * this.xOff;

//Similarly, "random" is used so that the flow direction of the river is not only positive, it can also be negative, so that the y coordinate of the river will move in different directions.
		this.yOff += random(-0.5, 0.5); // Movement direction up and down
      
      //Added "noise" function, so that the effect of the river spread card will be smooth and more similar to the real river satellite image.
		this.nY = noise(this.location.y) * this.yOff;
      
//Set the movement of the x-axis and y-axis, and the movement will be a silky motion in the form of "noise"
		this.location.x += this.nX; // move
		this.location.y += this.nY;

	}

	draw() {
		stroke(this.c);
		
		ellipse(this.location.x, this.location.y, this.radius * 50, this.radius * 50);
	}
}