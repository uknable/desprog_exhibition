//All text related stuff in this file
function drawText(){

  let text1Size = 72;
  let text2Size = 32;
  
  if (width <= 600){//if width is slightly bigger than full size Text change text size (for phones and small screens)
    text1Size = 40;
    text2Size = 18;
  }
  
  
  
  
  let textWords1 = "Impulse Acoustics";
  let textWords2 = "Acoustic Simulations By Justin Hauswirth";
  textFont(font);
  let textY= 250
  noStroke()
  
  //Text line 1
  textSize(text1Size)
  let bBox1 = font.textBounds(textWords1, width/2, textY, text1Size)
  let textWidth1 = bBox1.w;
  let textHeight1 = bBox1.h;
  text(textWords1, width/2 - (textWidth1 / 2), textY - (textHeight1 / 2));
  
  
  //Text line 2
  textSize(text2Size)
  let bBox2 = font.textBounds(textWords2, width/2, textY, text2Size)
  let textWidth2 = bBox2.w;
  let textHeight2 = bBox2.h;
  text(textWords2, width/2 - (textWidth2 / 2), textY + (textHeight2 / 2));

  
 //Each text line has a bounding box which is summed to create the total bounding Box
 let totalBox = {
   x : bBox2.x - (textWidth2 / 2),
   y : bBox1.y - (textHeight1 / 2),
   h : bBox1.h + bBox2.h + 10,
   w : bBox2.w + 25
   }; //This is just a single box object but it has the same value system as the     ReflectorBox constructor so Ray.reflect() works the same

  return totalBox; //Returns text bounding box object so we can send it to the ReflectorBox constructor
}




function caseTextDraw(inText){ //Stuff about what boxes.js case is being used
  push()
  textSize(32)
  fill(255, 127)
  if (inText){
    let bBox = font.textBounds(inText, width/2, height - 400, 32);
    text(inText, (width / 2) - (bBox.w / 2), height / 2);
  }
  pop()
}


function promptText(){ //Text that shows only at the beggining of the sketch
  push()
  textSize(18)
  fill(255, promptTextAlpha)
  let bBox = font.textBounds("Click Anywhere to create an impulse", width/2, height - 400, 18);
    text("Click Anywhere to create an impulse", (width / 2) - (bBox.w / 2), height / 2 - 50);
  if (frameCount % 2 == 0){
  promptTextAlpha--;
  }
  pop()
}
