// color palette
let palette;

// graphics layers
let UICanvas;
let particleCanvas;
let UICircleMaxSize;
let UICurrentCircleSize;

// buttons
let exploreButton;
let homeButton;

// 2d terrain system (using marching squares)
let terrain;

// blurry randomize gradient
let gradientBackground;

// left margin offset (px)
const TEXT_MARGIN_LEFT = 20;

// user inputs
let brushRadius = 5;
const MAX_BRUSH_SIZE = 10;
const MIN_BRUSH_SIZE = 1;

// whether the the UI show
let hideText = false;

function setup() {
  // create canvas to fit browser's width / width
  createCanvas(windowWidth, windowHeight);
UICircleMaxSize = height * 2;
  UICurrentCircleSize = UICircleMaxSize + 50;

  // get a colour palette with a random hue
  let paletteHue = random(360);
  palette = getColorPalette(paletteHue);

  // create an empty graphics canvas for UI elements
  UICanvas = createGraphics(windowWidth, windowHeight);
  UICanvas.clear();

  // create buttons
  exploreButton = new Button(TEXT_MARGIN_LEFT + (200 / 2), 400, 200, 50, "Explore");
  homeButton = new Button(TEXT_MARGIN_LEFT + (200 / 2) + 225, 400, 200, 50, "Home");

  // blurry animated background
  gradientBackground = new blurredGradient(width, height, 0, 0, palette, 3, 500, 1000, 100);

  // creates the terrain with marching squares
  terrain = new MarchingSquaresGrid(width, height, 25, 0.5);

  // the different attributes of each particle type / id
  // cohesion: how strong are the same particles pulled together
  // aversion: how strong are particles pushed to / away from solid terrain
  const particleParams = [
    { "id": 0, "colour": palette[0], "cohesion": 0.1, "aversion": -0.5 },
    { "id": 1, "colour": palette[1], "cohesion": 0.05, "aversion": -1.5 },
    { "id": 2, "colour": palette[2], "cohesion": 0.2, "aversion": -0.25 },
  ]
  particleSim = new ParticleSimulation(width, height, 50, terrain, particleParams);

  // 
  noStroke();
  noFill();
}

function getColorPalette(primary_hue) {
  // returns a colour pallete with analogous colors

  // bias to skip greenish hues because they have really poor constrast with white
  // (because eyes are really sensitive to the colour green)
  if (primary_hue >= 30 && primary_hue <= 160) {
    primary_hue += 105;
  }

  // gets 
  const hue_offset = (primary_hue + 50) % 360;
  const hue_offset_2 = (primary_hue + 30) % 360;
  colorMode(HSB);
  analogousPalette = [
    color(primary_hue, 100, 100),
    color(hue_offset, 100, 100),
    color(hue_offset_2, 50, 100)];
  colorMode(RGB);
  return analogousPalette;
}

function exploreButtonCallback() {
  // calback function for when `explore` is pressed
  hideText = true;
}

function homeButtonCallback() {
  // calback function for when `home` is pressed
  console.log("Home");
  // this would sent the user to the main web page
}

function draw() {
  // change in seconds per frame (handy for making animations consistent)
  // const dt = deltaTime / 1000 // change in time (delta) seconds
  // console.log(`Framerate: ${(1 / dt).toFixed(2)} FPS`); // DEBUG: framerate counter

  UICanvas.clear(); // clear the UI layer after last draw 

  // draw the blurry coloured gradient (because the gradient moves)
  gradientBackground.draw();

  fill(255);
  noStroke();

  // gets the closest grid position on the terrain  
  const gridMousePos = terrain.ScreenSpaceToGridSpace(mouseX, mouseY);

  // max size of circles drawn to show user's brush
  let brushCircleSizeMax = 5;

  if (mouseIsPressed == true) { // for placing terrain
    brushCircleSizeMax = 10;
    let value = 0.1; // additive value
    if ((mouseButton == RIGHT) || keyIsDown(SHIFT)) { // for removing terrain
      value = -0.1; // subtractive value
    }
    // adds values to terrain's 2d point array in circular shape
    terrain.addValueCircle(gridMousePos.x, gridMousePos.y, brushRadius, value);
  }

  // draw brush shape
  for (let x = -brushRadius + gridMousePos.x; x < brushRadius + gridMousePos.x; x++) {
    for (let y = -brushRadius + gridMousePos.y; y < brushRadius + gridMousePos.y; y++) {
      let circleBrushSize = map(sqrDist(gridMousePos.x, gridMousePos.y, x, y), 0, pow(brushRadius, 2), brushCircleSizeMax, 0, true);
      circle(x * terrain.SQUARE_SIZE, y * terrain.SQUARE_SIZE, circleBrushSize);
    }
  }

  // draw terrain
  terrain.draw();

  // draw particles
  particleSim.draw();

  // draw white circle (behind UI)
  fill(255);
  noStroke();
  circle(0, height/4, UICurrentCircleSize);

  // title
  UICanvas.push();
  UICanvas.translate(0, 0);
  UICanvas.noStroke();
  UICanvas.fill("black")
  UICanvas.textSize(50)
  UICanvas.textAlign(LEFT);

  // main title
  UICanvas.text("Lachlan Forsyth-Smith", TEXT_MARGIN_LEFT, 100)

  // subtitle
  UICanvas.textSize(25)
  UICanvas.text("Design Computing Student @ USYD", TEXT_MARGIN_LEFT, 100 + 50);

  // body copy
  UICanvas.text(`Hi there!\nI'm a sydney student with a passion for computer graphics and programming.`,
    TEXT_MARGIN_LEFT, 200, TEXT_MARGIN_LEFT + 500, 350 + 200);

  // if should show text / UI, render it
  if (!hideText) {
    UICurrentCircleSize = lerp(UICurrentCircleSize, UICircleMaxSize, 0.1);
    if (UICurrentCircleSize >= UICircleMaxSize - 50) {
      // draw UI
      exploreButton.drawButtonToLayer(UICanvas);
      homeButton.drawButtonToLayer(UICanvas);

      // check if user clicked either button
      exploreButton.didClick(exploreButtonCallback);
      homeButton.didClick(homeButtonCallback);
      image(UICanvas, 0, 0);
      if (Button.isMouseOverButtons(UICurrentCircleSize/1200)) {
        cursor(HAND);
      } else {
        cursor(ARROW);
      }
    }
  } else { // else lerp UI circle to zero
    cursor(ARROW);
    UICurrentCircleSize = lerp(UICurrentCircleSize, 0, 0.1);
  }
  UICanvas.pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gradientBackground.resize(width, height);
  UICircleMaxSize = height * 2;

  // this is not a perfect way to resize the terrain, its performance might be problematic (mostly memory usage)
  // Ideally i would implement a class method resize the terrain, keeping the same object (and keeping the values edited)
  resizedTerrain = new MarchingSquaresGrid(width, height, (terrain.SQUARE_SIZE), terrain.valueThreshold);
  terrain = resizedTerrain;
  // we need to update the particle sim's reference to terrain
  particleSim.terrain = resizedTerrain;

  // resize UI layer
  UICanvas = createGraphics(width, height);
  UICanvas.clear();
}

function mouseWheel(event) {
  brushRadius = constrain(round(brushRadius + event.delta / 100), 1, 10);
}

// lets you open and close text with ESC button
function keyPressed() {
  if (keyCode == ESCAPE) {
    hideText = !hideText;
  }
}

function sqrDist(x1, y1, x2, y2) {
  // this is *much* faster than `dist()` by skipping costly sqrt approximations (about 4x from profiling)
  // NOTE: will not return the exact distance but the distance^2
  // return value likely should be scaled down or compared with another squared value
  // https://en.wikipedia.org/wiki/Magnitude_(mathematics)#Euclidean_vector_space
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}