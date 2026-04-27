const particles = [];
let hueShift = 0;
const BURST_STRENGTH = 10;
const BASE_SPEED_LIMIT = 3;
const BURST_SPEED_MULTIPLIER = 0.85;
const BURST_DECAY = 0.9;
const BURST_DIRECTION_JITTER = 0.45;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  for (let i = 0; i < 180; i += 1) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(8, 10, 16, 32);
  hueShift = (hueShift + 0.3) % 360;

  for (const particle of particles) {
    particle.update();
    particle.show();
  }
}

function mousePressed() {
  for (const particle of particles) {
    particle.kick(mouseX, mouseY);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.4, 1.6));
    this.acc = createVector();
    this.size = random(2, 5);
    this.seed = random(1000);
    this.burstBoost = 0;
  }

  update() {
    const mouse = createVector(mouseX, mouseY);
    const force = p5.Vector.sub(mouse, this.pos);
    const distLimit = constrain(force.mag(), 20, 250);
    force.setMag(map(distLimit, 20, 250, 0.35, 0.01));

    this.acc.add(force);
    this.vel.add(this.acc);
    this.burstBoost *= BURST_DECAY;
    this.vel.limit(BASE_SPEED_LIMIT + this.burstBoost);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
    noStroke();
    const glow = map(noise(this.seed + frameCount * 0.01), 0, 1, 120, 255);
    fill(`hsla(${(hueShift + this.seed) % 360}, 90%, 70%, ${glow / 255})`);
    circle(this.pos.x, this.pos.y, this.size * 2.4);

    stroke(255, 255, 255, 26);
    strokeWeight(0.6);
    line(this.pos.x, this.pos.y, this.pos.x - this.vel.x * 7, this.pos.y - this.vel.y * 7);
  }

  kick(originX, originY) {
    const burstRadius = 140;
    const toParticle = p5.Vector.sub(this.pos, createVector(originX, originY));
    const distance = toParticle.mag();

    if (distance > burstRadius) {
      return;
    }

    const safeDistance = max(distance, 0.001);
    const strength = map(safeDistance, 0, burstRadius, 3.8, 0.4) * BURST_STRENGTH;
    this.burstBoost = max(this.burstBoost, strength * BURST_SPEED_MULTIPLIER);

    if (distance < 0.001) {
      toParticle.set(p5.Vector.random2D());
    }

    toParticle.rotate(random(-BURST_DIRECTION_JITTER, BURST_DIRECTION_JITTER));
    toParticle.setMag(strength);
    this.vel.add(toParticle);
  }
}
