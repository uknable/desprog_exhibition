class blurredGradient {
    constructor(width, height, x, y, palette, blobCount = 5, minSize = 300, maxSize = 1000, blurAmount = 250) {
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.blobs = [];
      this.blurAmount = blurAmount;
      this.paused = false;
      this.backgroundColour = palette[2]
  
      this.layer = createGraphics(this.width, this.height);
      this.layer.background(this.backgroundColour);
      this.minSize = minSize;
      this.maxSize = maxSize;
      // use built-in blur filter to blur the background render layer
      this.layer.drawingContext.filter = `blur(${blurAmount}px)`;
  
      for (let i = 0; i < blobCount; i++) {
        const posX = random(this.width);
        const posY = random(this.height);
        const blob = {
          x: posX,
          y: posY,
          colour: random(palette),
          size: random(minSize, maxSize)
        }
        this.blobs.push(blob);
        this.timer = 0;
      }
    }
    shouldRedraw() {
      /*
      is true every ~1/24 seconds (24fps)
      because blur() is slow, we should only calculate a few times a second)
      */
      this.timer += deltaTime;
      if (this.timer >= 42 && !this.paused) {
        this.timer = 0;
        return true;
      }
      return false;
    }
    draw() {
      if (this.shouldRedraw()) {
        this.layer.noStroke();
        this.layer.background(this.backgroundColour);
        for (let i = 0; i < this.blobs.length; i++) {
          const blob = this.blobs[i];
          this.drawBlob(blob.x, blob.y, blob.colour, blob.size);
          // updates blobs to move around with noise
          const timeScale = deltaTime * 0.05;
          const magnitude = 5;
  
          blob.x += map(noise(millis() / 4000, i), 0, 1, -magnitude, magnitude) * timeScale;
          blob.y += map(noise(millis() / 4000, i, 1), 0, 1, -magnitude, magnitude) * timeScale;
  
          // constrain blob position to layer
          blob.x = constrain(blob.x, 0, this.width);
          blob.y = constrain(blob.y, 0, this.height);
  
          // add / substract size with noise
          blob.size += map(noise(millis() / 1000, i, 1), 0, 1, -1, 1) * timeScale;
          blob.size = constrain(blob.size, this.minSize, this.maxSize);
        }
      }
      // draw layer to cavas
      image(this.layer, this.x, this.y);
    }
    resize(newX, newY) {
      // resize graphics by creating a new layer
      this.layer = createGraphics(newX, newY);
      this.layer.background(this.backgroundColour);
      this.layer.drawingContext.filter = `blur(${this.blurAmount}px)`;
      for (let i = 0; i < this.blobs.length; i++) {
        const blob = this.blobs[i];
        blob.x = map(blob.x, 0, this.width, 0, newX);
        blob.y = map(blob.y, 0, this.height, 0, newY);
        blob.size = blob.size / (this.width / newX); // makes size of blobs proportional to window width
      }
      this.width = newX;
      this.height = newY;
    }
    drawBlob(posX, posY, colour, size) {
      this.layer.fill(colour);
      this.layer.circle(posX, posY, size);
    }
  }