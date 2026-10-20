
let mic;
let amp;
let started = false;

let smoothVolume = 0;
let previousX;
let previousY;
let distanceTraveled = 0;

function setup() {
  createCanvas(1200, 800);
  background(255);

  mic = new p5.AudioIn();
  amp = new p5.Amplitude();
  mic.connect(amp);
}

function draw() {
  if (!started) return;

  let volume = amp.getLevel();

  // Smooth out sudden volume changes
  smoothVolume = lerp(smoothVolume, volume, 0.08);

  if (mouseIsPressed) {
    let dx = mouseX - pmouseX;
    let dy = mouseY - pmouseY;
    let distance = dist(mouseX, mouseY, pmouseX, pmouseY);

    if (distance < 0.5) return;

    let steps = max(2, ceil(distance / 2));

    stroke(0);
    strokeWeight(1);
    noFill();

    for (let i = 1; i <= steps; i++) {
      let t = i / steps;

      let x = lerp(pmouseX, mouseX, t);
      let y = lerp(pmouseY, mouseY, t);

      let progress = distanceTraveled + distance * t;

      // Sound volume controls wave amplitude
      let wave = sin(progress * 0.08) * smoothVolume * 500;

      // Wave moves perpendicular to mouse direction
      let nx = -dy / distance;
      let ny = dx / distance;

      let newX = x + nx * wave;
      let newY = y + ny * wave;

      line(previousX, previousY, newX, newY);

      previousX = newX;
      previousY = newY;
    }

    distanceTraveled += distance;
  }
}

async function mousePressed() {
  if (!started) {
    try {
      await mic.start();
      started = true;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  previousX = mouseX;
  previousY = mouseY;
  distanceTraveled = 0;
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    background(255);
  }

  if (key === 's' || key === 'S') {
    saveCanvas('smooth-sound-drawing', 'png');
  }
}
