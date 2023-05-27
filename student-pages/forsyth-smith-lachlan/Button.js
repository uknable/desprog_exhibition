
class Button {
    // here we're using JS's new `static` keyword to associate variables / functions to the `Button` type instead of an instance
    static button_elements = [];
  
    static addButtonElements(button) {
      Button.button_elements.push(button);
    }
  
    static isMouseOverButtons() {
      for (let i = 0; i < Button.button_elements.length; i++) {
        if (Button.button_elements[i].isMouseHovering()) {
          return true;
        }
      }
      return false;
    }
    constructor(x, y, width, height, text, fill_color = 0, text_color = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.text_value = text;
      this.fill_color = fill_color;
      this.text_color = text_color;
      this.animation_state = 0;
  
      // appearance
      this.default_opacity = 0;
      this.hover_opacity = 255;
      this.fade_lerp_speed = 5; // alpha value (0.0-1.0) per second
      this.opacity = this.default_opacity;
      Button.addButtonElements(this);
    }
    drawButtonToLayer(layer) {
      layer.push();
  
      const hovering = this.isMouseHovering();
  
      // target opacity will be 0 if mouse is not hovering, else it will be the hover opacity
      if (hovering) {
        this.animation_state += (deltaTime / 1000) * this.fade_lerp_speed;
      } else {
        this.animation_state -= (deltaTime / 1000) * this.fade_lerp_speed;
      }
      this.animation_state = constrain(this.animation_state, 0, 1);
      this.opacity = constrain(lerp(this.default_opacity, this.hover_opacity, this.animation_state), 0, this.hover_opacity);
      const expand_factor = lerp(0, 5, this.animation_state * this.animation_state);
      layer.translate(this.x, this.y);
      layer.rectMode(CENTER);
  
      // button box
      layer.strokeWeight(1.5);
      layer.stroke(this.fill_color);
      layer.fill(0, this.opacity);
      layer.rect(0, 0, this.width + expand_factor, this.height + expand_factor, 0);
  
      // button text 
      layer.noStroke(1);
      layer.fill(hovering * 255)
      layer.textSize(20)
      layer.textAlign(CENTER, CENTER);
      layer.text(this.text_value, 0, 0)
      layer.pop();
    }
    move(x, y) {
      this.x = x;
      this.y = y;
    }
    isMouseHovering(scaleFactor) { // if mouse is hovering over button
      return ((mouseX < (this.x + (this.width) / 2) )
        && (mouseX > (this.x - (this.width) / 2)  )
        && (mouseY < (this.y + (this.height) / 2) )
        && (mouseY > (this.y - (this.height) / 2) ));
    }
  
    didClick(callback) { // if cursor is over button and mouse is pressed then call the `callback` function
      if (this.isMouseHovering() && mouseIsPressed) {
        callback();
      }
    }
  }