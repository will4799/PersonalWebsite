const NOISESCALE = 0.02;
const CAPACITY = 0.6;

let STARTUPSPEED;

const BATT_HEIGHT_RATIO = 0.61;
const BATT_Y_OFFSET = 0.1;
const BATT_X_OFFSET = 0.63;

class Turbine {
  constructor(x, y, cellW, cellH, name) {
    
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = cellW;
    this.h = cellH;
    this.size = 0.75 * min(cellW, cellH);
    this.resized = false;
    this.fontSize = 0.1 * this.size;
    this.turbOffset = createVector(-cellW/7,0);
    this.battOffset = createVector(cellW/3, cellH/13);
    this.angle = 0;
    this.startUpFactor = 0;
    this.charge = 0;
    this.maxVal = CAPACITY*random(7500, 10000);
    this.seed = floor(random(999999999));
    this.finished = false;
  }
  
  update() {
    STARTUPSPEED = NOISELEVEL/500000;
    this.resize();
    push();
    translate(width/2, height/2);
    this.drawRect();
    this.drawName();
    this.drawTurb();
    this.calcCharge();
    this.drawBattery();
    this.checkWinCon();
    pop();
  }
  
  resize() {
    // This should probably be done outside of the class since they are all same size, but ah well
    if (!this.resized) {
      imgs.get('turbTop').resize(this.size, this.size);
      imgs.get('turbBase').resize(this.size, this.size);
      imgs.get('batt').resize(0.4*this.size, 0.8*this.size);
      this.resized = true;
}

  }
  
  drawRect() {
    push();
    stroke(0);
    strokeWeight(0.5);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
  
  drawName() {
    push();
    textAlign(CENTER);
    stroke(0);
    strokeWeight(0.25);
    textSize(this.fontSize);
    text(this.name, this.x, this.y - this.size/3);
    pop();
  }
  
  drawTurb() {
    // imgs.get('turbTop').resize(this.size, this.size);
    // imgs.get('turbBase').resize(this.size, this.size);
    
    push();
    translate(this.turbOffset.x, this.turbOffset.y);
    image(imgs.get('turbBase'), this.x, this.y);
    translate(this.x - this.size/6.5, this.y - this.size/6);  // Move turbTop relative to turbBase to center on top of shaft
    rotate(this.angle);
    image(imgs.get('turbTop'), this.size/100, -this.size/24);
    // circle(0, 0, 15);
    pop();
    let noiseOffset = this.startUpFactor * NOISELEVEL * noise(NOISESCALE * (frameCount + this.seed));
    if (!this.finished) {
      this.angle += noiseOffset;
    }
    this.startUpFactor = min(this.startUpFactor + STARTUPSPEED, 1);
  }
  
  drawBattery() {
    // imgs.get('batt').resize(0.4*this.size, 0.8*this.size);
    
    push();
    translate(this.turbOffset.x + BATT_X_OFFSET*this.size, this.turbOffset.y + BATT_Y_OFFSET*this.size);
    image(imgs.get('batt'), this.x, this.y);
    this.revealBatteryCharge();
    pop();
  }
  
  calcCharge() {
    this.charge = map(this.angle, 0, this.maxVal, 0, 1);
    this.charge = min(this.charge, 1);
  }
  
  revealBatteryCharge() {
    let currCharge = (1-this.charge) * 0.61*this.size;
    push();
    stroke(255);
    translate(0, 0.02*this.size);
    rect(this.x-0.15*this.size, this.y-0.3*this.size, 0.3*this.size, currCharge);
    pop();
  }
  
  checkWinCon() {
    if (this.charge == 1) {
        this.finished = true;
    }
  }
}