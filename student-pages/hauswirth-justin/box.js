class ReflectBox {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
     }
  
  drawBox() {
    push();
    
    fill(220)
    stroke(220)
    beginShape();
    
    vertex(this.x, this.y);
    vertex(this.x + this.w, this.y);
    vertex(this.x + this.w, this.y + this.h);
    vertex(this.x, this.y + this.h);
    
    endShape(CLOSE);
    
    pop();
  }  
}