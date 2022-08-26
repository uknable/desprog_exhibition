//Aim:
//The aim of this generative and interactive artwork is to generate feelings of calmness and an atmosphere of serenity that viewers are to be immersed in. The sketch combines two elements: crystals, which create a sense of grounding and connection (allowing them to connect to myself and my work in design) and energy flow fields (chakras), which humans are made out of. Crystals interact with the human's energy to form balance and alignment, allowing the viewer to feel relaxed and calm before viewing the rest of the website. The generating art of the energy fields were inspired by emergence as they grow and develop in a distinct, smooth pattern each time the sketch is run. It also incorporates cybernetics and 'designing behaviour' by mimicking the biological representations of humans through the energy that runs through them (as we are made of atoms) (https://www.sciencedirect.com/science/article/pii/S2095754818300358) . The generative art surrounds and rotates in a three-dimensional canvas to further enhance this 'entrapment' of the viewer in an environment of serenity and peace.

//Setting variables up in the Global Scope
let angle = 0; // This first angle deals with the movement of the lines on the 3D elements (the generative design), which will be forming the energy field pattern. Sin() and cos() is used later in the sketch, so defining this angle as 0 is important.
let angle2 = 0; // The second angle is related to the movement of the 3D elements themselves (the large, rotating cube and rotating crystal within the box).
let energyField; // This is the name of the generative design that runs throughout the sketch, and is different each time. It is to mimic the energy field that each human has. This facilitates the creation of this calming and peaceful atmosphere as stated in the aim.

// A size variable is defined for the ellipse in the generative design (which will be making the smooth flow-like line pattern and energy field on the surrounding cube).
let ellipseSize = 1;
let mappedSize; //this variable will be used to map the size of the ellipse later, relative to the user's mouse or finger (on a touch screen). This will change the thickness of the flowing lines of the energy field.

let backgroundColourArray = []; //this array will be used to colour the background of the 3D shapes.
//These variables relate to the translated position and movement of the centre crystal, depending on the user's finger or mouse movement.
let xTranslation = 0;
let yTranslation = 0;
let zTranslation = 0;

//creating an array for the points that will be drawn on the sketch and everything else related to the generative design
let points = [];
let thickness = 30; //thickness refers to the number of points in each row of the sketch
let distance; //distance determines the space between these points.
let position;
let redValue, greenValue, blueValue; // setting up RGB colour values to later map to different values
let x, y; // x and y co-ordinates for the points and ellipses.

let soothingAudio; //background audio will be played throughout when the sketch runs, further facilitating the peaceful and serene experience


function preload() {//making sure the audio is preloaded so it can play as soon as the sketch runs
  soothingAudio = loadSound('serenity (Zero O Clock).mp3')//the audio included is a LOFI edit of the song "Zero O Clock" (originally sang by BTS) by Smyang Piano. I chose this as the background audio since BTS is an artist I personally resonate healing with, and the lyrics of the song are spiritually and emotionally empowering. Lo-Fi music in particular reduces distractions by allowing the brain to subconsciously focus. It also helps generate an calming atmosphere. (https://www.japannakama.co.uk/the-mental-health-benefits-of-lo-fi-hip-hop-chill-beats/)
}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);//// In order to create a peaceful and calming atmosphere,  I needed to create a third dimension in my sketch which could only be done by introducing the WEBGL constant, allowing for 3D rendering. I was thus able to include 3D elements in the code, including the crystal and surrounding cube.
    soothingAudio.play();//The audio should be played throughout the experience of viewing and interacting with the hero image, so it was placed in setup.

  //Filling background colour array with colours I picked out myself - I used references to crystals and stones such as rose quartz (pastel pink), amethyst (violet/purple), pink sapphire (deep pink), moonstone (pastel blue), jade (green), orange quartz (deep orange), and black onyx (black). These are linked below.
  //According to Healthline (https://www.healthline.com/health/healing-crystals-what-they-can-do-and-what-they-cant), crystals can prevent bad energy and boost the body's aura. Different crystals provide different meanings, so I wanted to ensure I included different varieties in my code.
  backgroundColourArray = [
    color("#fceaeb"), // light pink
    color("#F7ECE7"), //pastel peach
    color("#e9d4d5"), //dusty pink - rose quartz: healing and compassion/love (https://www.healthline.com/health/healing-with-rose-quartz#takeaway)

    color("#fecfb2"), // peachy orange - orange quartz: stimulates  joyful energy of the inner child, encouraging playfulness and curiosity (https://feelcrystals.com.au/product-category/crystal-meanings/tangerine-quartz/#:~:text=Tangerine%20Quartz%20Crystal%20Healing%20Properties,levels%2C%20from%20sexuality%20to%20creativity.)

    color("#eee0ec"), // pastel purple - amethyst: tranquilises mood, natural stress reliever and negativity dissolver (https://www.healthline.com/health/amethyst-healing-properties)

    color("#ffd4d4"), // pink - pink sapphire: elegance, enduring hardship, commitment (https://www.crystalvaults.com/crystal-encyclopedia/sapphire-pink/)

    color("#dff3ed"), // pastel turquoise - jade: good fortune and growth (https://www.healthline.com/health/jade-stone-benefits)
    color("black"), // black - black onyx: protect from evil and willpower (https://thecrystalcouncil.com/crystals/black-onyx)
  ];


  // I was inspired by using 'createGraphics' after applying it in [Week 6: Recommended Challenge] Image Masking With Second Canvas on the Canvas website. (https://canvas.sydney.edu.au/courses/39753/pages/week-6-recommended-challenge-image-masking-with-second-canvas?module_item_id=1454270)
  energyField = createGraphics(windowWidth, windowHeight); //createGraphics is a p5.js built in class that will allow me to create the multiple canvases needed to depict the 3D element of the sketch, further reinforcing the idea of escapism or being entrapped by a calming and grounding energy that surrounds the viewer in a three-dimensional rather than two-dimensional way. This amplifies this immersive experience even further.

  //These lines of code are setting up the starting points of the sketch. Any stroke on the points will minimise the calming effect and desired aesthetic of the design, so no stroke is added.
  energyField.noStroke();
  energyField.background(random(backgroundColourArray)); //There is randomness to the background of the crystal and surrounding environment to avoid any predictable patterns. The type of colour and the crystal it represents should provide a different meaning to the viewer each time they visit my portfolio website.
  distance = width / thickness; // The distance between the points of the sketch is determined by a relative value (width) divided by a constant (thickness, or number of points in each row) to ensure the visual effect is the same despite changing window sizes.
  
  //the distance variable will be used in the nested for loop (creating a row based on x and y co-ordinates of each point) to create the starting points. The number of points and the distance between them was carefully articulated to create a visible, generative design that is clean and does not overwhelm the user - which counteracts the feeling of calmness and serenity that should be evoked.
  for (let x = 0; x < width; x += distance) {
    for (let y = 0; y < height; y += distance) {
      position = createVector(x + random(-20, 20), y + random(-20, 20)); // a Vector is created for each x and y co-ordinate. There is randomness added to the starting position to ensure the flow field is different each time for each viewer, as it will not be a personalised experience otherwise. Each human is made of energy, but this energy varies depending on the person, so it was important to consider that in my sketch in order for it to be truly 'generative' and emerge differently each time. This was also adapted from Week 10 Challenge 1 on Canvas (https://canvas.sydney.edu.au/courses/39753/pages/week-10-required-challenge-intro-to-vectors?module_item_id=1454285)
      points.push(position); // the vector created for the position of each point is added to the points array using the 'push' method. This will facilitate the aspect of 'emergence' in the sketch as it will generate the continuous and harmonious wave-like line patterns to mimic a 360-degree angle energy flow field. I was informed on how to allow the sketch to generate through Week 6 challenge 4 on Canvas, which used the array method (.push) to add elements to an array. (https://canvas.sydney.edu.au/courses/39753/modules).
    }
  }
}

function draw() {
  // soothingAudio.play();
  stroke("white");
  strokeWeight(4);

 texture(energyField); // The use of texture to allow the generative design to wrap around the canvases of the 3D elements. This was inspired by codes from https://editor.p5js.org/ri1/sketches/f-sso0EE8

  generativeDesign(0.005, 400); //placing this function in draw to run continuously at each frame.

  //transformations including translation and rotations are used in the following lines of code. It is important to store these using push() and pop() so the atmosphere and feeling of serenity can be portrayed as desired. If not, the box surrounding the crystal ends up also moving according to the mouse (which should only be for the crystal) which ultimately disrupts the peaceful experience.
  
  push();
  translate(xTranslation, yTranslation, zTranslation); //I learned that with adding 3D elements to a sketch using WEBGL, the default translation is (width/2, height/2), so the origin point is always at the centre. The translation is already at (0,0) in the centre, so xTranslation and yTranslation relates to the viewer's movements as they interact with the code (changing the x and y position of the crystal), and zTranslation refers to the distance of the 3D elements from the screen (the z axis)

  //Rotate X, Y and Z are used for 3D elements in p5.js to move them in different angles.
  rotateX(mouseX * 0.02); //The user can interact with the crystal in the centre by changing its rotation according to the X and Y position of the viewer's mouse. This means although the viewer is in a constrained sense of serenity, they still have some control in this energy field. It helps convey that this experience with the code is individual and personal to them.
  rotateY(mouseY * 0.02);
  rotateZ(angle2); // Because it is possible the portfolio website, and hence the hero image, can be viewed from a touch screen device instead, an angle that increments is included in the third rotation so there is some calming movement mimicking energy flowing rather than stillness.
  ellipsoid(width / 7, width / 4, width / 7, 5, 3);
  pop(); //With trial and error, I was able to use the ellipsoid function with specific values in each parameter that replicated a standard crystal shape. I'm very interested in crystal healing and feel as if this is highly representative for me as a person, thus I thought it would be exciting to include in a hero image for my portfolio. This shape would be most recognisable to viewers as a crystal, which would facilitate in communicating the message. I chose to base the size off the relative value of width rather than height (since Hero images are usually rectangular and are likely to be wider rather than taller) to allow the code to be responsive for different sized screens.
  
  //Another 3D shape is used to create this rotating "border" around the crystal. It showcases the same generative design on the crystal to portray external and internal energy being radiated. This is to represent how the viewer can absorb a positive flow of energy internally, and also  release some as well. This is significant for being in tune with one's environment and deeply connecting to it.
  push(); 
  noStroke(); // no stroke to remove the 'box' element to allow the cube to appear more like a circulating atmosphere of energy rather than a defined shape.
  rotateX(3); // The rotation at the X axis is set to an unchanging value 3. Although a small aspect to the rest of the sketch, it plays an important part in contributing to the serenity evoked by the hero image; an atmosphere that is not too fast or too slow but rather mimicking the speed of the way energy flows in humans.
  rotateY(width / 3.5 / 250); //Rotation amongst the Y axis is based off a relative value (width) to ensure this atmospheric cube rotates similarly among varying window sizes. The values to divide width was based off ensuring the rotation does not become too fast and make the viewer overwhelmed or dizzy.
  rotateZ(angle2); //This rotation moves the overarching 'atmosphere' in the clockwise direction, further adding to building up this tranquilising environment.
  box(width + 100); //The size of the box has been set to just over the relative value of the width to ensure it remains visible as the external environment as the crystal. When width is smaller, only one side of the box can be seen rotating on the screen with the generative design. This provides viewers who are, for example, seeing the hero image on the website with their phones pointing vertically, a surprise if they were to tilt their phone horizontally. The width will become larger and the crystal inside provides a special and pleasant surprise to evoke feelings of positivity and calmness.
  pop();

  //Angle 2 (used for both the 'box' and crystal, is incremented by 0.01 for continuous movement, conveying liveliness and energy flow).
  angle2 += 0.003;

  //the constrains and controls functions (down below) are inserted in the draw loop for the interactivity (controls) and creating a border around the sketch so no elements disappear (constrains).
  constrains();
  interactiveControls();
}
//This is the main function which develops the pink energy flowing particles in the sketch. It was inspired and adapted from the colourful flow fields created by https://www.youtube.com/watch?v=1-QXuR-XX_s
function generativeDesign(amount, mapValue2) {
  
  //This for loop iterates through the starting points that were created in the setup function. It will generate the energy fields by creating a flow-like pattern from each point. points.length will return the number of elements in the points array as the maximum, informed by Week 9 Challenge 1 on Canvas (https://canvas.sydney.edu.au/courses/39753/pages/week-9-required-challenge-using-objects?module_item_id=1454278)
  for (let i = 0; i < points.length; i++) {
    
    //Colour that will remain consistent throughout will be of the lines creating the flow fields, which have been mapped to different values of red, green and blue to generate different shades of pink. This is the shade of Star Ruby. This stone assists in integrating "high frequency energy" in humans and guiding them to identify and acknowledge the abundance of life - as a way to stay humble. I resonate deeply with the meaning behind this crystal, as well as it originating from India, which is my ethnicity.
    //(https://www.crystals-online.co.uk/properties-pages/star-ruby/#:~:text=It%20is%20said%20to%20assist,of%20abuse%20of%20any%20sort.)
    //The RGB values of pink were picked from https://www.canva.com/colors/color-meanings/pink/
    redValue = map(points[i].x, 0, width, 220, 230);
    greenValue = map(points[i].y, 0, width, 110, 120);
    blueValue = map(points[i].x, 0, width, 125, 135);

    //This colour has been used to fill the ellipses making up the points of the energy field.
    energyField.fill(redValue, greenValue, blueValue);

    // An angle for the direction of movement of each point or ellipse is defined by mapping the points to a set mapped value (mapValue2). The noise function was used to create the direction, and ultimately this energy flow field. This would  be a visual representation of each human's "energy". The variable 'amount' can control how fast the angle changes for each x and y co-ordinate of each point. This has currently been set to 0.005 to look more like smooth lines which aligns with the energy field inspiration more, rather than clumps. Noise is used to create more solidarity and flow compared to random.
    let angle = map(
      noise(points[i].x * amount, points[i].y * amount),
      0,
      1,
      0,
      mapValue2
    );

    //Another interactive element of the generative design is that the viewer can change the thickness of each point depending on where their mouse OR finger is on the screen where the hero image is located. This is another subtle interaction that the user only finds out about once they actively engage with the sketch, as this calming energy and experience can only be offered and felt by those who seek it. A thin line on the sketch can evoke different emotions compared to a thicker line. A thin line in an energy flow is more calming, quieter and soothing, whereas a thicker line and represent boldness, loudness and excitement - which can represent different personalities. It brings this energy field to life and connects it to different individuals, and thus helping them connect to me and my work.
    mappedSize = map(
      ellipseSize,
      0,
      1,
      0,
      mouseX * 0.006 || touchMoved * 0.008
    );
    //
    points[i].add(createVector(cos(angle), sin(angle))); //A vector is added to each point depending on the angle. The use of sin and cos will allow a flowing line to evolve and grow from each point on the design, and help create a harmonious energy field and thus, the sanctuary for peace. These lines are to replicate the movement of chakras, as they spin energy out of the body in a clockwise direction and external energy is absorbed inside in an anti-clockwise direction.(https://naadwellness.com/chakras-spinning-the-wheels-of-soulful-living.php )
    points[i].x += 0.05; //the x and y co-ordinates of each point continue to shift very slightly to add further movement to these energy fields.
    points[i].y += 0.05;
    energyField.ellipse(points[i].x, points[i].y, mappedSize); //an ellipse is formed at each x and y co-ordinate of each point, allowing the point to appear as a smooth line with varying thickness (depending on the user's mouse or finger movement).

    energyField.angle += 0.01; //to ensure the energy field flows (or the generative design generates and emerges) the angle must be incremented each frame.
  }
}

//This function controls the movement of the crystal to ensure it does not leave the window of whichever type of screen it is being viewed from. It was inspired by the use of constrain in Week 8 Challenge 3 on Canvas (https://canvas.sydney.edu.au/courses/39753/pages/week-8-required-challenge-image-pixel-walker?module_item_id=1454275)
function constrains() {
  xTranslation = constrain(xTranslation, -width / 3, width / 3); //It was calculated that these relative values will allow the crystal to not escape the boundaries of the sketch.
  yTranslation = constrain(yTranslation, -width / 3, width / 3);
  zTranslation = constrain(zTranslation, -width / 2, width / 2);
}

//For those viewing the screen from a device with a keyboard, they can interact with the sketch on the different keys to press. This is not informed to the viewer, it is more an action they can take spontaneously to see what happens. The purpose of this interaction is to allow the user to feel more as if they control their own experience and that they have agency in this realm of peace and serenity, as they have independence over their own lives.
function interactiveControls() {
  if (keyCode == UP_ARROW) {
    //The keys pressed relate heavily to the consequential action that takes place. For example, If the 'up' arrow is pressed, for example, the y position of the crystal will continue to go up on the canvas (until it reaches the end of the constrained values, in which it will stop).
    yTranslation -= 0.5;
  }
  if (keyCode == DOWN_ARROW) {
    yTranslation += 0.5;
  }
  //These if statements relate to the movement of the crystal along the x axis (right and left).
  if (keyCode == LEFT_ARROW) {
    xTranslation -= 0.5;
  }
  if (keyCode == RIGHT_ARROW) {
    xTranslation += 0.5;
  }
  //These if statements relate to the movement of the crystal from the back of the screen to the front. If the user clicks delete, the crystal will go further and further from the screen, and if clicked return, it'll 'return' back to the screen.
  if (keyCode == DELETE) {
    zTranslation -= 1;
  }
  if (keyCode == RETURN) {
    zTranslation += 1;
  }
  //When shift is pressed, the crystal will 'shift' back to its original translated position, to the centre of the screen.
  if (keyCode == SHIFT) {
    xTranslation = 0;
    yTranslation = 0;
    zTranslation = 0;
  }
}
//This ensures the interactive elements of the sketch is responsive whether on a touchscreen or device with a keyboard. By touching on the screen or clicking the sketch, the user can change the background to a random crystal-inspired colour and the number of octaves in the noise function changes to 2.5, creating a more clear, round pattern.
function touchStarted() {
  noiseDetail(2);
  energyField.background(random(backgroundColourArray));
}
function mouseClicked() {
  noiseDetail(2);
  energyField.background(random(backgroundColourArray));
}


//Similar to interactive controls, this function aims to offer a similar experience of being in control of the way the ksetch is presented by changing the crystal's positioning using the user's finger instead, if they are viewing from a touch screen device. This is more restricted however, since movement is determined by where, specifically, the user touches the screen.
function touchMoved() {
  if (touches < width / 2) {
    xTranslation -= 0.5;
  } else if (touches > width / 2) {
    xTranslation += 0.5;
  } else if (touches < height / 2) {
    yTranslation -= 0.5;
  } else if (touches > height / 2) {
    yTranslation += 0.5;
  }
}

//Similar to using the 'return' tab if the viewer is viewing the website with a keyboard. If not, when the user removes their finger, the crystal returns back to the centre of the screen as a form of "restarting" this experience of serenity.
function touchEnded() {
  xTranslation = 0;
  yTranslation = 0;
  zTranslation = 0;
}

// Using this built-in p5.js function to enable the code to be responsive and adapt to changing screen sizes. Any size values in the code were based off relative values to avoid distortion from varying canvas width or height, which would not allow the serene experience to be communicated as strongly or effectively.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
