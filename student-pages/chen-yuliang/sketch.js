let times = 0;
let vel = 0;
// The number of intermediate circles
let hori_count = 14;
let vert_count = 14;
// The gradient color of the center circle
let colors = [
  "#F94144",
  "#F65A38",
  "#F3722C",
  "#F68425",
  "#F8961E",
  "#F9AF37",
  "#F9C74F",
  "#C5C35E",
  "#90BE6D",
  "#6AB47C",
  "#43AA8B",
  "#4D908E",
  "#52838F",
  "#577590",
];
// It's used to store the coordinates of the stars
let stars = [];
// To store the speed of the stars
let vels = [];
// Used to store the measurements of stars
let sizes = [];
// The value used to store changes in the size of the star
let addition = 0.03;

function setup() {
  // Canvas size is full
  createCanvas(windowWidth, windowHeight);
  // rotational speed
  vel = TWO_PI / 300;
  
  strokeWeight(3);

  // Used to initialize the position, velocity, and size of the star
  for (let i = 0; i < 200; i++) {
    stars.push(createVector(random(width), random(height)));
    vels.push(createVector(random(-1, 1), random(-1, 1)));
    sizes.push(random(3));
  }
}

function draw() {
  // color of the background
  background(0);

  
  for (let i = 0; i < stars.length; i++) {
    fill(255);
    noStroke();
    // draw stars
    ellipse(stars[i].x, stars[i].y, sizes[i], sizes[i]);
    // the movement of the stars
    stars[i].x += vels[i].x;
    stars[i].y += vels[i].y;
    // When the star hits the boundary, it bounces back
    if ((stars[i].x > width) | (stars[i].x < 0)) {
      vels[i].x *= -1;
    }
    if ((stars[i].y > height) | (stars[i].y < 0)) {
      vels[i].y *= -1;
    }
    // changes in the size of the stars
    sizes[i] += addition;
    if ((sizes[i] > 6) | (sizes[i] < 0)) {
      addition *= -1;
    }

    // When the stars are close together, they connect
    for (let j = i + 1; j < stars.length; j++) {
      let d = dist(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      if (d < 100) {
        stroke(255, 255-d*2.5);
        strokeWeight(1.5);
        line(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
      }
    }

    // When the mouse is close to the star, it also connects
    if (dist(stars[i].x, stars[i].y, mouseX, mouseY) < 80) {
      stroke(255, 0, 0);
      line(stars[i].x, stars[i].y, mouseX, mouseY);
    }
  }
  
    noFill();
  for (let y = 0; y < vert_count; y++) {
    for (let t = 0; t < hori_count; t++) {
      // Using two layers of for cycle, the circle is rotated and the size of the circle is changed at the same time to form a regular change
      r = map(sin(times / 2 + t / 4 + y / 3), -1, 1, 10, 100);
      y_pos = map(
        sin(times / 8 + t / 2 + y / 2),
        -1,
        1,
        -200, 200
      );
      x_pos = map(
        cos(times / 8 + t / 2 + y / 2),
        -1,
        1,
        -200, 200
      );
      stroke(colors[y]);
      circle(x_pos+width/2, y_pos+height/2, r*1.5);
    }
  }
  // Time increment
  times += vel;
}

// When the screen size changes, it automatically ADAPTS
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}