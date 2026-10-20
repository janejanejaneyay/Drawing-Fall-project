let mic;
let amp;
let started = false;

function setup() {
    createCanvas(1200, 800);
  background(255);

  mic = new p5.AudioIn();
  amp = new p5.Amplitude();

  mic.connect(amp);
}

function draw() {
  if (!started) {
    fill(0);
    textSize(16);
    return;
  }

  let volume = amp.getLevel();
  let wave = sin(frameCount * 0.3) * volume * 500;

  if (mouseIsPressed) {
    stroke(0);
    strokeWeight(1);

    line(
      pmouseX,
      pmouseY,
      mouseX,
      mouseY + wave
    );
  }

  fill(0);
  noStroke();
  rect(0, 0, 140, 40);

  fill(255);
  textSize(14);
  text("vol: " + volume.toFixed(4), 10, 25);
}

async function mousePressed() {
  if (!started) {
    await mic.start();
    started = true;
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    background(255);
  }

  if (key === 's' || key === 'S') {
    saveCanvas('sound-line', 'png');
  }
}