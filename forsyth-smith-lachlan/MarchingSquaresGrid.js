
class MarchingSquaresGrid {
  
  constructor(width, height, pixelsPerSquare, valueThreshold = 0.5) {
    // 2D array of floating points values
    this.points = []

    // array containing changes to the 2d point array (2d pos, add value)
    this.editBuffer = []

    // array dimensions
    this.SIZE_X = ceil(width / pixelsPerSquare);
    this.SIZE_Y = ceil(height / pixelsPerSquare);

    // size of each square
    this.SQUARE_SIZE = pixelsPerSquare;

    // threshold at which square should be solid or not
    this.valueThreshold = valueThreshold;

    // create a dedicated graphics canvas for the squares 
    this.layer = createGraphics(width, height);

    // set fill and stroke weight because we won't need to change this during draw()
    this.layer.fill(255, 64);
    this.layer.strokeWeight(2);

    // construct 2D array for a point grid of floats
    for (let x = 0; x < ceil(width / pixelsPerSquare); x++) {
      let row = []
      for (let y = 0; y < ceil(height / pixelsPerSquare); y++) {
        let value = noise(x / 10, y / 10);
        row.push(value);
      }
      this.points.push(row);
    }
    // draw values
    this.drawSquares();
  }
  draw() {
    // if changes need to be made to the terrain
    if (this.editBuffer.length > 0) {
      for (let i = 0; i < this.editBuffer.length; i++) {
        // unpack edit
        const edit = this.editBuffer[i];
        const x = edit.x;
        const y = edit.y;
        const value = edit.value;

        // update value with change
        this.points[x][y] = constrain(value + this.points[x][y], 0, 1);
      }
      // clear the edit buffer
      this.editBuffer = []

      // because the points have been edited we need to redraw the squares
      this.drawSquares();
    }
    // display graphics to screen
    image(this.layer, 0, 0);
  }

  drawSquares() {
    // draws marching squares to `this.layer` canvas 

    // clear the canvas because we are drawing it again
    this.layer.clear();
    // redraw the terrain
    for (let gridPosX = 0; gridPosX < this.SIZE_X; gridPosX++) {
      let screenPosX = (gridPosX * this.SQUARE_SIZE);
      for (let gridPosY = 0; gridPosY < this.SIZE_Y; gridPosY++) {
        let screenPosY = (gridPosY * this.SQUARE_SIZE);

        // make sure to get values first before we start changing them
        let neighboringValues = this.getNeighboringValues(gridPosX, gridPosY);
        const corners = this.getCorners(screenPosX, screenPosY);
        const sides = this.getSides(screenPosX, screenPosY, neighboringValues, this.valueThreshold);
        const case_index = this.getCase(neighboringValues, this.valueThreshold);

        // draw solid square area
        this.layer.stroke(255, 10);
        this.drawMarchedSquare(case_index, sides, corners)

        // draw outline
        this.layer.stroke(255);
        this.drawMarchedLine(case_index, sides, corners)
      }
    }
  }

  addEdit(x, y, addValue) {
    // add a edit to edit buffer to be processed
    this.editBuffer.push({ "x": x, "y": y, "value": addValue })
  }

  getCorners(startPosX, startPosY) {
    // returns the 4 screen positions of a square's corners
    const topleft = new p5.Vector(startPosX, startPosY);
    const topright = new p5.Vector(startPosX + this.SQUARE_SIZE, startPosY);
    const bottomleft = new p5.Vector(startPosX, startPosY + this.SQUARE_SIZE);
    const bottomright = new p5.Vector(startPosX + this.SQUARE_SIZE, startPosY + this.SQUARE_SIZE);
    return [topleft, topright, bottomright, bottomleft]
  }

  getSides(startPosX, startPosY, values, threshold) {
    // returns the 4 screen positions of a square's edges
    /*
    square sides given here:
    |-----------|
    |     a     |
    | d       b |
    |     c     |
    |-----------|
    */
    // slides the edges with lerp for smoother contours
    const side_a = createVector(
      lerp(startPosX, startPosX + this.SQUARE_SIZE, this.getEdgeSlideAlpha(values[0], values[1], threshold)),
      startPosY
    );
    const side_b = createVector(
      startPosX + this.SQUARE_SIZE,
      lerp(startPosY, startPosY + this.SQUARE_SIZE, this.getEdgeSlideAlpha(values[1], values[3], threshold))
    );
    const side_c = createVector(
      lerp(startPosX, startPosX + this.SQUARE_SIZE, this.getEdgeSlideAlpha(values[2], values[3], threshold)),
      startPosY + this.SQUARE_SIZE
    );
    const side_d = createVector(
      startPosX,
      lerp(startPosY, startPosY + this.SQUARE_SIZE, this.getEdgeSlideAlpha(values[0], values[2], threshold))
    );
    return [side_a, side_b, side_c, side_d]
  }

  drawMarchedSquare(case_index, sides, corners) {
    // https://en.wikipedia.org/wiki/Marching_squares
    const side_a = sides[0];
    const side_b = sides[1];
    const side_c = sides[2];
    const side_d = sides[3];
    const topleft = corners[0];
    const topright = corners[1];
    const bottomright = corners[2];
    const bottomleft = corners[3];
    switch (case_index) {
      case 0:
        break;
      case 1:
        this.drawTriangle(side_c, side_b, bottomright)
        break;
      case 2:
        this.drawTriangle(side_c, side_d, bottomleft)
        break;
      case 3:
        this.layer.quad(side_d.x, side_d.y,
          side_b.x, side_b.y,
          bottomright.x, bottomright.y,
          bottomleft.x, bottomleft.y)
        break;
      case 4:
        this.drawTriangle(side_a, side_b, topright);
        break;
      case 5:
        this.layer.quad(side_a.x, side_a.y,
          topright.x, topright.y,
          bottomright.x, bottomright.y,
          side_c.x, side_c.y)
        break;
      case 6:
        this.drawTriangle(side_d, side_c, bottomleft);
        this.drawTriangle(side_a, side_b, topright);
        break;
      case 7:
        this.layer.beginShape();
        this.layer.vertex(side_a.x, side_a.y);
        this.layer.vertex(topright.x, topright.y)
        this.layer.vertex(bottomright.x, bottomright.y)
        this.layer.vertex(bottomleft.x, bottomleft.y)
        this.layer.vertex(side_d.x, side_d.y);
        this.layer.endShape();
        break;
      case 8:
        this.drawTriangle(side_a, side_d, topleft);
        break;
      case 9:
        this.drawTriangle(side_a, side_d, topleft);
        this.drawTriangle(side_b, side_c, bottomright);
        break;
      case 10:
        this.layer.quad(topleft.x, topleft.y,
          side_a.x, side_a.y,
          side_c.x, side_c.y,
          bottomleft.x, bottomleft.y)
        break;
      case 11:
        this.layer.beginShape();
        this.layer.vertex(topleft.x, topleft.y);
        this.layer.vertex(side_a.x, side_a.y)
        this.layer.vertex(side_b.x, side_b.y)
        this.layer.vertex(bottomright.x, bottomright.y)
        this.layer.vertex(bottomleft.x, bottomleft.y);
        this.layer.endShape();
        break;
      case 12:
        this.layer.quad(topleft.x, topleft.y,
          topright.x, topright.y,
          side_b.x, side_b.y,
          side_d.x, side_d.y)
        break;
      case 13:
        this.layer.beginShape();
        this.layer.vertex(topleft.x, topleft.y);
        this.layer.vertex(topright.x, topright.y)
        this.layer.vertex(bottomright.x, bottomright.y)
        this.layer.vertex(side_c.x, side_c.y)
        this.layer.vertex(side_d.x, side_d.y);
        this.layer.endShape();
        break;
      case 14:
        this.layer.beginShape();
        this.layer.vertex(topleft.x, topleft.y);
        this.layer.vertex(topright.x, topright.y)
        this.layer.vertex(side_b.x, side_b.y)
        this.layer.vertex(side_c.x, side_c.y)
        this.layer.vertex(bottomleft.x, bottomleft.y);
        this.layer.endShape();
        break;
      case 15:
        // this case is when the square is completely solid
        // so we just draw a square from topleft 
        this.layer.square(topleft.x, topleft.y, this.SQUARE_SIZE);
        break;
    }
  }
  isPointSolid(x, y) {
    // return true if grid coordinates contain a square that is solid
    const values = this.getNeighboringValues(x, y);
    const square_shape_index = this.getCase(values, this.valueThreshold);
    // case value 0 is empty space so we check the opposite for solid
    return square_shape_index != 0;
  }

  drawMarchedLine(case_index, sides) {
    // draws a marched square given its index and edge positions (for interpolation)
    const side_a = sides[0];
    const side_b = sides[1];
    const side_c = sides[2];
    const side_d = sides[3];
    switch (case_index) {
      case 0:
        break;
      case 1:
        this.drawLine(side_c, side_b)
        break;
      case 2:
        this.drawLine(side_c, side_d)
        break;
      case 3:
        this.drawLine(side_d, side_b)
        break;
      case 4:
        this.drawLine(side_a, side_b);
        break;
      case 5:
        this.drawLine(side_a, side_c);
        break;
      case 6:
        this.drawLine(side_d, side_c);
        this.drawLine(side_a, side_b);
        break;
      case 7:
        this.drawLine(side_a, side_d)
        break;
      case 8:
        this.drawLine(side_a, side_d);
        break;
      case 9:
        this.drawLine(side_a, side_d);
        this.drawLine(side_b, side_c);
        break;
      case 10:
        this.drawLine(side_a, side_c)
        break;
      case 11:
        this.drawLine(side_a, side_b);
        break;
      case 12:
        this.drawLine(side_b, side_d);
        break;
      case 13:
        this.drawLine(side_c, side_d)
        break;
      case 14:
        this.drawLine(side_b, side_c);
        break;
      case 15:
        break;
    }
  }
  getNeighboringValues(x, y) {
    // gets neighboring values in the 2d points grid given a grid location
    // if values are out of bounds they wrap around size x and size y  
    let values =
      [
        this.points[nmod(x + 0 + this.SIZE_X, this.SIZE_X) % this.SIZE_X][nmod(y + 0 + this.SIZE_Y, this.SIZE_Y)],
        this.points[nmod(x + 1 + this.SIZE_X, this.SIZE_X) % this.SIZE_X][nmod(y + 0 + this.SIZE_Y, this.SIZE_Y)],
        this.points[nmod(x + 0 + this.SIZE_X, this.SIZE_X) % this.SIZE_X][nmod(y + 1 + this.SIZE_Y, this.SIZE_Y)],
        this.points[nmod(x + 1 + this.SIZE_X, this.SIZE_X) % this.SIZE_X][nmod(y + 1 + this.SIZE_Y, this.SIZE_Y)],
      ];
    return values;
  }
  getEdgeSlideAlpha(f1, f2, threshold) {
    // return how much a edge vertex should be slided with interpolated (0-1) for smooth geometry
    // learnt algorithm here: http://jamie-wong.com/2014/08/19/metaballs-and-marching-squares/
    const value_2 = f2;
    const value_1 = f1;
    return constrain((threshold - value_1) / (value_2 - value_1), 0, 1);
  }
  getCase(values, threshold) {
    // this returns the case index (for marching squares)
    // given four point values of a square clockwise (top left, top right, bottom right, bottom left) 
    // if a value is > the threshold, we want to render it
    const case_values =
      [
        values[0] > threshold,
        values[1] > threshold,
        values[2] > threshold,
        values[3] > threshold
      ];
    // returns 4 bit encoded case value for square marching 
    return ((8 * case_values[0]) + (4 * case_values[1]) + (2 * case_values[2]) + (case_values[3]));
  }
  ScreenSpaceToGridSpace(x, y) {
    // converts screen position (float) to nearest grid position (int)
    const gridPosX = Math.round((x / this.SQUARE_SIZE));
    const gridPosY = Math.round((y / this.SQUARE_SIZE));
    // returns an object with an x and y value (could use vector but we're only working with integers here)
    return {
      "x": gridPosX,
      "y": gridPosY
    }
  }
  
  isInsideGrid(x, y) {
    const is_in_bounds_x = x < this.SIZE_X || x >= 0;
    const is_in_bounds_y = y < this.SIZE_Y || y >= 0;
    return (is_in_bounds_x && is_in_bounds_y)
  }

  addValueCircle(gridX, gridY, radius, valueFactor = 1) {
    // sets a square of values (given x,y origin and radius)
    // min() and max() makes sure we dont iterate through values outside the grid
    for (let x = max(gridX - radius, 0); x < min(gridX + radius, this.SIZE_X); x++) {
      for (let y = max(gridY - radius, 0); y < min(gridY + radius, this.SIZE_Y); y++) {
        let value = map(sqrDist(gridX, gridY, x, y), 0, pow(radius, 2), 1, 0);
        if (valueFactor > 0) {
          this.addEdit(x, y, constrain(valueFactor * value, 0, 1));
        } else {
          this.addEdit(x, y, constrain(valueFactor * value, -1, 0));
        }
      }
    }
  }
  drawTriangle(a, b, c) {
    // draws a triangle to canvas given 3 vectors
    this.layer.triangle(
      a.x, a.y,
      b.x, b.y,
      c.x, c.y
    );
  }
  drawLine(a, b) {
    // draws a line to canvas given 2 vectors
    this.layer.line(a.x, a.y, b.x, b.y);
  }
}

function nmod(value, modulus) {
  // js mod (%) doesn't work well with negative values :( 
  // e.g. nmod should be -1 % 300 -> 299
  // learnt this method from this solution at https://stackoverflow.com/questions/4467539
  return int(((value % modulus) + modulus) % modulus);
}