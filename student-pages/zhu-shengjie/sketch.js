// I edited the song for the purposes of the promotional video

// hero image
let song;
let fft;
let spectrum;
let angle = 0;
let atarget = 0;
let stretch = 96;
let starget = 96;
let limit;
let nodes = 5;
let zoom = 0.1;
let ztarget = 1;
let img;

function preload() {
  //Loading Music
	song = loadSound('music.mp3');
  //Add a picture of the text (font software is not available, so I added a picture of my favorite font)
  img = loadImage("flower.png");
  img1 = loadImage("flower1.png");
}

function setup() {
  //Make a canvas as window size
	let cnv = createCanvas(windowWidth, windowHeight);
	limit = min(width, height) / 2;
	background(0);
//   //Play the background music-Hey Joe
// 	song.play();
	cnv.mouseClicked(togglePlay);
  // Music sound spectrum data reading
	fft = new p5.FFT(0.9, 64);
	colorMode(HSB, 360);
	background(0);
}


function windowResized() {
  //Screen size update
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  //Add background color
	background(0, 0, 0, 10);

	// //Write the instruction to users
	// push();
	// fill(255);
	// noStroke();
	// textSize(15);
	// text("Click the page to control the playing sound.", width * 0.08, height * 0.08);
	// pop();

  //Reading the sound spectrum
	spectrum = fft.analyze();
  push();
  //Coordinate origin is the center of the screen
	translate(width / 2, height / 2);
	scale(0.25 + abs(zoom));
	noFill();
  //Line color and sound combination
	stroke((2*spectrum[8] + mouseX)%360, abs(stretch * 45), 360);
  //Line width setting
	strokeWeight(0.25);
	atarget = map(mouseX, 0, width, 0, 0.01);
  //Angle increment
	angle += atarget;
	atarget *= 0.9;
	starget = map(mouseY, 0, height, -8, 8);
	stretch = lerp(stretch, starget, 0.05);
  //Rotation of the pattern
	rotate(angle);
  //Zoom value setting
	ztarget = map(mouseX, 0, width, -3, 3);
	zoom = lerp(zoom, ztarget, 0.1);
  //Using a "for" loop, connect each point by "vertex" to form a curve
	for (let i = 0; i < nodes; i++) {
		offset = TWO_PI / nodes;
		rotate(offset);
		beginShape();
		curveVertex(0, 0);
		for (let i = 0; i < spectrum.length; i += 1) {
			let a = i * stretch * (TWO_PI / 96);
			let r = (30 + (spectrum[i] * i / 15));
			let x = cos(a) * r;
			let y = sin(a) * r;
			curveVertex(x, y);
		}
		endShape();
	}
  pop();
  //Add text to the image
     imageMode(CENTER);
     image(img, width/2, height/2-width/16*1.5, width/3, width/14);
     image(img, width/2, height/2, width/3, width/14);
     image(img, width/2, height/2+width/16*1.5, width/3, width/14);
   //Add text images and add dithering effects
     image(img1, width/2, height/2+width/16*3 + ((spectrum[10])*0.2-30), width/3, width/22);

}

//Play the sound when mouse is clicked
function togglePlay() {
	if(song.isPlaying()){
		// song.pause();
	} else {
		song.loop();
		//The number of petals increase when the song is playing, the maximum number is 9
		nodes += 1;
		if (nodes > 9) nodes = 2;
	}

}
