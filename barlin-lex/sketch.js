let backgroundWaves = [];
let micWaves = [];
let numWaves = 6;
let frequency = 0;
let input;
let col;
let textLayer;
let myFont;

function preload() {
  myFont = loadFont("BebasNeue-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(RGB);

  // create a new audio in object (access the user's microphone).
  input = new p5.AudioIn();
  input.start();

  //creates an object containing text to be superimposed atop the Wave objects later in the sketch.
  textLayer = createGraphics(width, height);
  makeText();

  //the following 2 for loops create the Wave objects in both the backgroundWaves array (background waves that aren't affected by user input), and the micWaves array (the more prominent waves that are affected by user input). The Wave objects are created in different groups given different initial parameters to create a more interesting generative output.
  for (i = 0; i < numWaves; i++) {
    if (i <= numWaves / 4) {
      backgroundWaves[i] = new Wave(random(7.5, 10), frequency / 4, 4, 50);
    } else if (i > numWaves / 4 && i <= numWaves / 2) {
      backgroundWaves[i] = new Wave(random(5, 7.5), frequency / 3, 3, 150);
    } else if (i > numWaves / 2 && i <= numWaves - numWaves / 4) {
      backgroundWaves[i] = new Wave(random(2.5, 5), frequency, 2, 200);
    } else {
      backgroundWaves[i] = new Wave(random(1, 2.5), frequency, 1, 255);
    }
  }

  for (i = 0; i < numWaves * 2; i++) {
    micWaves[i] = new Wave(random(1, 10), frequency, 3, 255);
  }
}

function draw() {
  //background set to semi-transparent to create trails resenmbilng an oscilloscope.
  background(0, 18);

  //draw the Wave objects in the backgroundWaves array.
  for (i = 0; i < backgroundWaves.length; i++) {
    backgroundWaves[i].draw();
  }

  //draw the Wave objects in the micWaves array.
  //This for loop also sets the colour of the Wave objects in the micWaves array based on the input level from the microphone. The input level is mapped exponentially and the parameters are fine tuned to give a more sensitive response.
  //(try whistling into the mic for maximum sustained effect)...
  for (i = 0; i < micWaves.length; i++) {
    let micLevel = map(input.getLevel(0.9), 0, 0.2, 0, 2);
    let micR = map(exp(micLevel), 0, 4, 255, 50, true);
    let micG = map(exp(micLevel), 0, 4, 50, 75, true);
    let micB = map(exp(micLevel), 0, 4, 50, 255, true);
    let brightness = map(exp(micLevel), 0, 4, 200, 255);
    col = color(micR, micG, micB, brightness);
    let shadowCol = color(micR, micG, micB);

    micWaves[i].micCol = col;
    micWaves[i].shadowColour = shadowCol;
    micWaves[i].draw();
  }
}

//the Wave class utilises object-oriented modelling to define and create "soundwaves" that traverse across the screen in various ways
class Wave {
  constructor(speed, frequency, weight, brightness) {
    this.col = 10;
    this.xPos = 0;
    this.amplitude = random(20, windowHeight / 2 - 50);
    this.frequency = frequency;
    this.count = 0;
    this.speed = speed;
    this.xOff = random(0, 1);
    this.weight = weight;
    this.brightness = brightness;
    this.shadowColour = color(
      random(200, 255),
      random(50, 75),
      random(10, 255)
    );
  }

  draw() {
    //frequency set to 0 for the first second of the animation to create the "flatline" intro
    if (frameCount / 60 < 1) {
      frequency = 0;
    } else {
      // this chunk of code creates subtle generative modulation by calculating a smoothed random number (offset) using perlin noise and adds it to the frequency of wave object.
      this.xOff = this.xOff + 0.01;
      let n = noise(this.xOff);
      this.offset = map(n, 0, 1, -0.4, 0.4);
      this.frequency += this.offset;
    }

    //this line of code adds the "speed" increment to the xPos of the Wave object to create movement each frame across the screen.
    this.xPos = this.xPos += this.speed;
    //this line checks if the xPos has reached the end of the screen and if so resets it to zero creating a looping oscilloscope of sorts.
    if (this.xPos >= windowWidth) {
      this.xPos = 0;
    }

    //the following 2 parameters calculate the current amplitude (y-coordinate) of each waveform and the amplitude one frame ago in order to draw a line object between the two.
    let amplitude = sin(this.count) * this.amplitude;
    let prevAmplitude = sin(this.count - this.frequency) * this.amplitude;

    //this nested if statement is used to set the colour value of the Wave objects in the backgroundWaves array to a gradient moving from red to blue and back to red and passes through the interactive colour value for Wave objects in the micWaves array by checking the value of this.micCol
    if (this.micCol == undefined) {
      if (this.xPos < width / 2) {
        this.col = map(this.xPos, 0, width / 2, 10, 255);
      } else {
        this.col = map(this.xPos, width / 2, width, 255, 10);
      }
    }

    //this chunk of code styles and draws the Wave objects to the canvas using the line function creating small lines each frame that connect to give the visual impression of a soundwave.
    push();
    image(textLayer, 0, 0, windowWidth, windowHeight);
    pop();
    push();
    translate(0, height / 2);
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = this.shadowColour;
    if (this.micCol == undefined) {
      stroke(this.col, 60, 75, this.brightness);
    } else {
      stroke(this.micCol);
    }
    strokeWeight(this.weight);
    line(this.xPos - this.speed, prevAmplitude, this.xPos, amplitude);
    pop();

    //this.count stores an ever-increasing number that is used as input for the sin function that calculates the amplitude (y-coordinate) at every xPos.
    this.count += this.frequency;
  }
}

//this function was initially provided to me by Joel Flanagan in the following sketch: https://editor.p5js.org/JoelsDemos/sketches/CsUuwUwlM
//tweaked to fit my sketch.
//the makeText function creates the text in the centre of the canvas and sizes it based on the size of the window in which its being displayed making it dynamic and adaptable to various displays.
//the function creates a background that is semi-transparent and then erases the text from the center. as the waves pass behind it they appear brighter in the mask of the text creating the impression of text.
function makeText() {
  textLayer.push();
  textLayer.background(0, 8);
  textLayer.textFont(myFont);
  textLayer.textSize(windowWidth / 4);
  textLayer.textAlign(CENTER, CENTER);
  textLayer.fill(0, 0, 0);
  textLayer.erase();
  textLayer.text("LEX BARLIN", width / 2, height / 2);
  textLayer.pop();
}

//this function simply scales the elements as the window size is altered to make the design more dynamic and stable.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (i = 0; i < backgroundWaves.length; i++) {
    backgroundWaves[i].amplitude = random(20, windowHeight / 2 - 50);
  }
  for (i = 0; i < micWaves.length; i++) {
    micWaves[i].amplitude = random(20, windowHeight / 2 - 50);
  }
}
