function generateBoxes(){ //Generates one of 6 different simulated acoustic treatments
  let boxNum;
  let caseWords;
  switch(caseNum) {
  
    case 0:
      //Case 0: Rows of ceiling panel type absorbers
      caseWords = "Ceiling Absorbers"
      boxNum = 15;
      boxes = [];
      for (let i = 0; i <= boxNum; i++){
        boxes.push(new ReflectBox(i * (width / boxNum), height - 200, 
                                 (width / (boxNum*3)) , 200));
    }
      break;
      
    case 1:
      //Case 1: Schroeder Diffuser
      caseWords = "Schroeder Diffuser"
      boxNum = 47; //Needs to be prime
      boxes = [];
      for (let i = 0; i <= boxNum; i++){
        let boxH = (i * i) % boxNum; //Schroeder diffuser height formula 
        boxH *= 4; 
        boxes.push(new ReflectBox(i * (width / boxNum), height - boxH, 
                                  width / boxNum      , boxH));
    }
      break;
      
      case 2:
      //Case 2: Sinusoidal Boxes
      caseWords = "Sinusoidal Diffuser"
      boxNum = 50;
      boxes = [];
      for (let i = 0; i <= boxNum; i++){
        let mapping = map(i, 0, boxNum, 0, TWO_PI * 4);
        let boxH = 25 * cos(mapping) + 100;
        boxes.push(new ReflectBox(i * (width / boxNum), height, 
                                  width / boxNum      , -boxH));
    }
      break;
      
      
      
      case 3:
      //Case 3: Semi Circle
      caseWords = "Circular Diffuser"
      let radius = (width / 2) - 100;
      boxNum = 50;
      boxes = [];
      for (let i = 0; i <= boxNum; i++){
        
        let mapping = map(i, 0, boxNum, 0, PI);
        let boxX = radius * cos(mapping) + width / 2;
        let boxY = radius * sin(mapping) - 100;
        boxes.push(new ReflectBox(boxX                , height, 
                                  (width / boxNum) + 5, -boxY));
    }
      break;
      
      case 4:
      //Case 4: Perlin Noise
      caseWords = "Perlin Noise";
      boxNum = 50;
      boxes = [];
      for (let i = 0; i <= boxNum; i++){
        let boxH = noise(i/10) * 300;
        boxes.push(new ReflectBox(i * (width / boxNum), height, 
                                  width / boxNum      , -boxH));
    }  
      break;
      
      case 5:
      //Case 5:: Empty
      caseWords = "Untreated Room";
      boxes = [];
  }
  return caseWords;
}