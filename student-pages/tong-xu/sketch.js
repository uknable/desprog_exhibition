// After entering the landing page, the user will see many light particles. Without human intervention, light particles close to each other will show cohesion. They follow random but structured tracks and attract each other to form a flow field.
// Users can:
// Move the mouse over a cluster of particles and let the particles dance around the mouse.
// Click on the screen to add some new particles.
// Click the icon in the upper left corner to switch scenes.
// Click the icon in the upper right corner to control the background music.
// Click enter to refresh the interface.
// If you can't see the button on the top right corner, don't worry, this is because the browser is not allowed to play the audio automatically.
// You can press F12 or refresh the page to see the button.


// Create some variables for the sketch
// Create an array for storting the points
var points = [];
var marginWidth; // margin around the edge of the canvas
var marginHeight; // margin around the edge of the canvas
// mult is used to contorl the speed of noise
var mult = 0.005;
// set a flag to make sure that some settings in setup will only be executed once
var p = 1;
// Create a variable to control the range of the mouse
var distance_point = 100;
// Manage user start of the audio context to happen once and only once
// reference: https://editor.p5js.org/samgwise/sketches/M5bJACZ7a
let audioStarted = false;
// reference: https://editor.p5js.org/samgwise/sketches/M5bJACZ7a
// create an array to store the sounds
let sounds = [];
// create the default color pallete
var colorPallete = ["#0a1c39", "#1c3d75"];
// create a flag to control the color
var colorControler = 1;
// The variable of song
var song;
// The button to play and stop the music
var controlAudio;
// A button to control the theme of the page
var controlDayAndNight;

function preload() {
  // Preload the sound files
  // reference: https://editor.p5js.org/samgwise/sketches/M5bJACZ7a
  // music from https://www.aigei.com/
  // Set which file extensions to look for
  soundFormats("mp3");
  song = loadSound("./audios/background");
  // load background from the audio folder
  // load the sound files and store them in the sounds array
  sounds.push(loadSound("./audios/Piano"));
  sounds.push(loadSound("./audios/Transition"));
}

function setup() {
  // set canvas in the center of the page
  // set margins according to window size
  marginWidth = windowWidth * 0.1;
  marginHeight = windowHeight * 0.1;
  // create a canvas
  var canvas = createCanvas(windowWidth, windowHeight);
  // set the canvas to the center of the page
  canvas.style("position", "relative");
  // When click the canvas, the mousePressed function will be called and the sound will play
  canvas.mousePressed(function () {
    triggerAudio(0);
  });
  // set colormode to HSB and angle mode to degrees and set noiseDetail
  colorMode(HSB, 359, 100, 100, 100);
  angleMode(DEGREES);
  noiseDetail(1, 0.5);
  // create default vectors
  // set the density of the points
  var density = 50;
  // calculate the cols and rows of the points
  var cols = floor(width / density);
  // create the points
  for (var x = 0; x < width; x += cols) {
    for (var y = 0; y < height; y += cols) {
      stroke(0);
      strokeWeight(1);
      var point = new Particle(
        x + random(-10, 10),
        y + random(-10, 10),
        colorControler
      );
      points.push(point);
    }
  }
  if (p === 1) {
    // if the flag is 1, the following sentences will be excuted, which contains: play the song, create the button to control the theme
    // create the button to control the audio
    song.loop();
    // create buttons to control the theme of the page
    controlDayAndNight = createA(
      "#",
      `<img src="./icons/moon.png" style="height:30px; width:30px; background:transparent;">`
    );
    // set the position of the button
    controlDayAndNight.style("position", "absolute");
    controlDayAndNight.style("top", `${marginHeight * 0.4}px`);
    controlDayAndNight.style("left", `${marginHeight * 0.6}px`);
    controlDayAndNight.style("background", "transparent");
    // create a button to control the audio
    controlAudio = createA(
      "#",
      `<img src="./icons/muteNight.png" style="height:30px; width:30px; background:transparent;">`
    );
    // set the position of the button
    controlAudio.style("position", "absolute");
    controlAudio.style("top", `${marginHeight * 0.4}px`);
    controlAudio.style("right", `${marginHeight * 0.6}px`);
    controlAudio.style("background", "transparent");
    // set the event listener for the button
  controlDayAndNight.mousePressed(function () {
    // when clicking the button, the sound of transition will play
    triggerAudio(1);
    // judge if the flag of colorControler is 1 or -1
    if (colorControler === 1) {
      // if the colorControler is 1, change the colorPallete to the day theme
      colorPallete = ["#f7f8f3", "#f5d0a4"];
      // change the icon to the day theme
      controlDayAndNight.html(
        `<img src="./icons/sun.png" style="height:35px; width:35px; background:transparent;">`
      );
    } else {
      // if the colorControler is -1, change the colorPallete to the night theme
      colorPallete = ["#0a1c39", "#1c3d75"];
      // change the icon to the night theme
      controlDayAndNight.html(
        `<img src="./icons/moon.png" style="height:30px; width:30px; background:transparent;">`
      );
    }
    // change the colorControler every time the button is clicked
    colorControler *= -1;
  });
  // set the event listener for the button
  controlAudio.mousePressed(function () {
    // when clicking the button, if the song is playing, stop the song
    if (song.isPlaying()) {
      song.pause();
    } else {
      // if the song is not playing, play the song
      song.play();
    }
  });
  }
  
}

function draw() {
  // draw the pattern
  // set the background color according to the pallete
  setGradient(
    0,
    0,
    width,
    height,
    color(colorPallete[0]),
    color(colorPallete[1])
  );
  // if the flag of showing the pattern is 1, draw the pattern
  // set the icon of the audio button according to the status of the song and theme
  if (colorControler === -1 && song.isPlaying()) {
    // if the song is playing and the theme is day, change the icon to the day theme
    controlAudio.html(
      `<img src="./icons/soundDay.png" style="height:30px; width:30px; background:transparent;">`
    );
  } else if (colorControler === 1 && song.isPlaying()) {
    // if the song is playing and the theme is night, change the icon to the night theme
    controlAudio.html(
      `<img src="./icons/soundNight.png" style="height:30px; width:30px; background:transparent;">`
    );
  } else if (colorControler === -1 && !song.isPlaying()) {
    // if the song is not playing and the theme is day, change the icon to the day theme
    controlAudio.html(
      `<img src="./icons/muteDay.png" style="height:30px; width:30px; background:transparent;">`
    );
  } else if (colorControler === 1 && !song.isPlaying()) {
    // if the song is not playing and the theme is night, change the icon to the night theme
    controlAudio.html(
      `<img src="./icons/muteNight.png" style="height:30px; width:30px; background:transparent;">`
    );
  }
  // tranverse the points array and draw the points
  for (let i = 0; i < points.length; i++) {
    // create mouseVector and set the mouse position to the mouseVector
    var mouseVector = createVector(mouseX, mouseY);
    // calculate the distance between the mouse and the point
    let d = dist(mouseX, mouseY, points[i].x, points[i].y);
    // use noise to create the move angle of the points
    var angle = map(
      noise(points[i].x * mult, points[i].y * mult),
      0,
      1,
      0,
      720
    ); // noise will return a value between 0 and 1, map it to a value between 0 and 720
    // call the function of edge (deal with the points which is moving out of the canvas)
    points[i].edge();
    // call the function of update (update the position of the points)
    points[i].update(cos(angle), sin(angle));
    if (d < distance_point) {
      // if the distance between the mouse and the point is less than the distance_point, scale up the point
      points[i].show(1.3);
    }
    // call the function of move(interact with the points according to the mouse position)
    points[i].move(mouseVector.copy());
    // call the function of show (draw the points)
    points[i].show(1, colorControler);
  }
}

function mousePressed() {
  // this function is used to generate some particles when clicking the mouse
  // it will random choose a number between 10 and 20 and generate the particles based on the number
  for (let i = 0; i < random(10, 20); i++) {
    // set the density of generative points
    var density = 20;
    // calculate the cols of generative points
    var cols = width / density;
    // create new Particle object
    var v = new Particle(mouseX, mouseY, colorControler);
    // set the initial position of the particle randomly
    v.x += random(-cols, cols);
    v.y += random(-cols, cols);
    // add the particle to the points array
    points.push(v);
  }
}

function reset() {
  // this function is used to reset the pattern
  // empty the points array
  points = [];
  // call setup function
  setup();
}

function keyPressed() {
  // this function is used to control the pattern
  if (keyCode === ENTER) {
    // if the ENTER key is pressed, change the flag of showing the pattern
    // set the flag to -1 because we never need it again unless the page has been totally refreshed
    p = -1;
    // call the function of reset
    reset();
  }
}

function windowResized() {
  // this function is used to resize the canvas based on the window size
  resizeCanvas(windowWidth, windowHeight);
}

function setGradient(x, y, w, h, c1, c2) {
  // reference: https://p5js.org/examples/color-linear-gradient.html
  // this function is used to simulate the gradient effect by drawing multiple lines
  // parameters: x - the x position of the top left corner of the color gradient area
  //           y - the y position of the top left corner of the color gradient area
  //           w - the width of the color gradient area
  //           h - the height of the color gradient area
  //           c1 - the first color of the gradient
  //           c2 - the second color of the gradient
  noFill();
  // Top to bottom gradient
  for (let i = y; i <= y + h; i++) {
    // map the value of i from y to y+h to 0 and 1
    let inter = map(i, y, y + h, 0, 1);
    // calculate the color of each line
    let c = lerpColor(c1, c2, inter);
    // draw the line with the stroke color of c
    stroke(c);
    line(x, i, x + w, i);
  }
}

function triggerAudio(index) {
  // this function is used to trigger the audio according to the index
  // reference: https://editor.p5js.org/samgwise/sketches/M5bJACZ7a
  // Start the audio playing (This has to happen in response to a user action due to browser security features)
  if (!audioStarted) {
    // if the audio has not been started automatically, start the audio
    userStartAudio();
    audioStarted = false;
  }

  // playing a sound file on a user gesture
  // Pick a sound from the list of sounds based on the index
  let sound = sounds[index];
  // Stop the sound if still playing
  sound.stop();

  // Map mouseY to how loud the sound should be played
  let amplitude = map(mouseY, height, 0, 0, 1);
  sound.amp(amplitude);

  // Map mouseX to position (left or right)
  let panning = map(mouseX, 0, width, -1, 1);
  sound.pan(panning);

  // Start playing the sound
  sound.play();
}

class Particle {
  // This is the object of Particle, which is used to generate the points and control the behaviour of the points
  constructor(x, y, colorControler) {
    // attributes of the Particle: x - the x position of the particle
    //                             y - the y position of the particle
    //                             accelerate - the accelerate of the particle (the speed of the particle is controlled by the mouse position)
    //                             velocity - the speed of the particle (the speed of the particle is controlled by the mouse position)
    //                             sat - Saturation of the color of the particle
    //                             brt - Brightness of the color of the particle
    //                             hu - Hue of the color of the particle
    //                             lifespan - used to control the life of the particle(alpha of the particle) and the frequenncy of some changes happens to the particles
    //                             radius - the radius of the particle(randomly generated in the constructor for each particle)
    this.x = x;
    this.y = y;
    this.accelerate = createVector();
    this.velocity = createVector();
    this.sat = colorControler === 1 ? 50 : 50;
    this.brt = colorControler === 1 ? 80 : 90;
    this.hu = colorControler === 1 ? 210 : 20;
    this.lifespan = 255;
    this.radius = random(5, 15);
  }

  edge() {
    // this function is used to deal with the points which are moving out of the canvas
    // not all the points will be dealed with, for each of points, there will be 50% chance to be dealed with when they move out of the canvas
    var controler = random([0, 1]);
    if (controler === 1) {
      // if the controler is 1, the point will be dealed with
      // the method of deal the points: if the point is moving out of the canvas, the point will be moved back to a random position in the canvas
      // and the lifespan of the point will be refreshed
      if (this.x > width) {
        this.x = random(0, width);
        this.y = random(0, height);
        this.lifespan = 255;
      } else if (this.x < 0) {
        this.x = random(0, width);
        this.y = random(0, height);
        this.lifespan = 255;
      }
      if (this.y > height) {
        this.x = random(0, width);
        this.y = random(0, height);
        this.lifespan = 255;
      } else if (this.y < 0) {
        this.x = random(0, width);
        this.y = random(0, height);
        this.lifespan = 255;
      }
    }
  }
  update(x_change, y_change) {
    // this function is used to update the position of the particle
    // parameters: x_change - offset distance of the x position of the particle
    //             y_change - offset distance of the y position of the particle
    this.x += x_change;
    this.y += y_change;
    // the lifespan of the particle will be decreased by a factor(here we set the factor to 0.5)
    this.lifespan = this.lifespan - 0.5;
  }
  show(multiple, colorControler) {
    // this function is used to show the particle
    // parameters: multiple - the multiple of the radius of the particle
    noStroke();
    // set the color of the particle according to the colorControler(the frequency of the color change is based on the lifespan of the particle)
    if (this.lifespan % 5 === 0 && colorControler === 1) {
      // these are the colors for the night theme (if colorControler is 1, which means that now it is night theme)
      this.hu = random(210, 250);
      this.sat = random(0, 100);
      this.brt = random(80, 100);
    } else if (this.lifespan % 5 === 0 && colorControler === -1) {
      // these are the colors for the day theme (if colorControler is -1, which means that now it is day theme)
      this.hu = random(20, 50);
      this.sat = random(0, 100);
      this.brt = random(90, 100);
    }
    // use fill to set the color of the particle (colorMode is HSB)
    fill(color(this.hu, this.sat, this.brt, this.lifespan));
    // use ellipse to draw the particle
    ellipse(this.x, this.y, this.radius * multiple, this.radius * multiple);
  }
  move(mouseVec) {
    // this function is used to move the particle according to the mouse position
    // reference: https://editor.p5js.org/DWAIL/sketches/yCZakD8wc
    // parameters: mouseVec - the vector of the mouse position
    // create a vector of the particle's position
    this.vector = createVector(this.x, this.y);
    //get vector from this.pos to mousePos
    mouseVec.sub(this.vector);
    if (mouseVec.mag() < 100) {
      //only effect the particles within 100 pixels of the mouse
      // the accelerate of the particle will be set according to the mouse position
      this.accelerate.set(mouseVec);
      // limit the length of the accelerate to 0.8
      this.accelerate.limit(0.8);
    } else {
      //remove the acceleration
      this.accelerate.set(0, 0);
      //slow down the particle when it is far away from the mouse
      this.velocity.lerp(0, 0, 0, 0.1);
    }
    //add acceleration to velocity
    this.velocity.add(this.accelerate);
    // chenge the position of the particle according to the velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
