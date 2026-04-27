let speedSlider;
let sliderLabel;
let NOISELEVEL = 100;

let nameInput, addButton, startButton;
let nameList = [];
let listContainer;

let imgs = new Map();
let turbs = [];
let orderedNames = [];
let simulationStarted = false;
let canvas;
let backgroundContainer;
let rankingContainer;

const NAME_STORAGE_KEY = 'name-randomiser:names';

function preload() {
  imgs.set('turbBase', loadImage('./assets/turb_base.png'));
  imgs.set('turbTop', loadImage('./assets/turb_top.png'));
  imgs.set('batt', loadImage('./assets/batt.png'));
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.hide();

  const savedNames = localStorage.getItem(NAME_STORAGE_KEY);
  if (savedNames) {
    try {
      const parsed = JSON.parse(savedNames);
      if (Array.isArray(parsed)) {
        nameList = parsed.filter((name) => typeof name === 'string' && name.trim() !== '');
      }
    } catch (_err) {
      nameList = [];
    }
  }

  // Fullscreen white background container
  backgroundContainer = createDiv();
  backgroundContainer.style('position', 'absolute');
  backgroundContainer.style('top', '0');
  backgroundContainer.style('left', '0');
  backgroundContainer.style('width', '100vw');
  backgroundContainer.style('height', '100vh');
  backgroundContainer.style('background-color', 'white');
  backgroundContainer.style('display', 'flex');
  backgroundContainer.style('justify-content', 'center');
  backgroundContainer.style('align-items', 'center');
  backgroundContainer.parent(document.body);

  // Centered UI container
  let uiContainer = createDiv();
  uiContainer.style('background-color', '#e0f7fa'); // Light cyan
  uiContainer.style('padding', '30px');
  uiContainer.style('border-radius', '12px');
  uiContainer.style('box-shadow', '0 4px 12px rgba(0,0,0,0.1)');
  uiContainer.style('min-width', '300px');
  uiContainer.style('text-align', 'center');
  uiContainer.parent(backgroundContainer);
  
  // Title
  let title = createElement('h2', '🎲 Will\'s Cool Randomiser');
  title.style('margin-bottom', '20px');
  title.style('font-family', 'sans-serif');
  title.style('color', '#004d40');
  title.style('font-size', '24px');
  title.parent(uiContainer);

  // Input field
  nameInput = createInput();
  nameInput.attribute('placeholder', 'Enter name');nameInput.style('padding', '10px');
  nameInput.style('border', '1px solid #ccc');
  nameInput.style('border-radius', '5px');
  nameInput.style('width', '100%');
  nameInput.style('box-sizing', 'border-box');
  nameInput.style('margin-bottom', '10px');
  nameInput.style('font-size', '16px');
  nameInput.parent(uiContainer);

  // Add button
  addButton = createButton('Add Name');
  addButton.mousePressed(addName);addButton.style('background-color', 'darkblue');
  // addButton.mousePressed(addName);addButton.style('background-color', '#00796b');
  addButton.style('color', 'white');
  addButton.style('padding', '10px');
  addButton.style('border', 'none');
  addButton.style('border-radius', '5px');
  addButton.style('width', '100%');
  addButton.style('font-size', '16px');
  addButton.style('margin-bottom', '10px');
  addButton.style('cursor', 'pointer');
  addButton.parent(uiContainer);

  // List container
  listContainer = createDiv();
  listContainer.style('margin-top', '10px');
  listContainer.parent(uiContainer);

  // Start button
  startButton = createButton('Generate!');
  startButton.mousePressed(startSimulation);
  startButton.style('margin-top', '20px');
  startButton.style('background-color', '#00796b');
  startButton.style('color', 'white');
  startButton.style('padding', '10px');
  startButton.style('border', 'none');
  startButton.style('border-radius', '5px');
  startButton.style('cursor', 'pointer');
  startButton.parent(uiContainer);
  
    // Speed slider
  speedSlider = createSlider(80, 480, 160, 1); // min, max, default, step
  speedSlider.style('width', '100%');
  speedSlider.style('margin-top', '30px');
  speedSlider.parent(uiContainer);

  // Speed label
  sliderLabel = createDiv('Simulation Speed: 1x');
  sliderLabel.style('margin-top', '10px');
  sliderLabel.style('font-family', 'sans-serif');
  sliderLabel.style('font-size', '18px');
  sliderLabel.style('color', '#000000');
  sliderLabel.parent(uiContainer);

  // End ranking window
  rankingContainer = createDiv();
  rankingContainer.style('position', 'absolute');
  rankingContainer.style('top', '50%');
  rankingContainer.style('left', '50%');
  rankingContainer.style('transform', 'translate(-50%, -50%)');
  rankingContainer.style('background-color', '#fff');
  rankingContainer.style('padding', '30px'); // Larger padding
  rankingContainer.style('border-radius', '12px');
  rankingContainer.style('box-shadow', '0 4px 16px rgba(0,0,0,0.25)');
  rankingContainer.style('font-family', 'sans-serif');
  rankingContainer.style('font-size', '20px'); // Larger font
  rankingContainer.style('text-align', 'center');
  rankingContainer.style('display', 'none');
  rankingContainer.parent(document.body);

  updateListUI();
}
  
function keyPressed() {
  if (keyCode === ENTER && document.activeElement === nameInput.elt) {
    addName();
  }
}


function addName() {
  let name = nameInput.value().trim();
  if (name !== '' & !nameList.includes(name)) {
    nameList.push(name);
    localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify(nameList));
    nameInput.value('');
    updateListUI();
  }
}

function updateListUI() {
  listContainer.html('');
  nameList.forEach((name, index) => {
    let nameItem = createDiv();
    nameItem.style('display', 'flex');
    nameItem.style('justify-content', 'space-between');
    nameItem.style('align-items', 'center');
    nameItem.style('padding', '5px 10px');
    nameItem.style('cursor', 'pointer');
    nameItem.style('background-color', '#f0f0f0');
    nameItem.style('border-radius', '4px');
    nameItem.style('margin-bottom', '4px');

    let nameText = createSpan(name);
    nameText.style('flex-grow', '1');
    nameText.style('font-size', '16px');

    let removeX = createSpan('×');
    removeX.style('color', '#808080');
    removeX.style('font-weight', 'bold');
    removeX.style('margin-left', '10px');
    removeX.style('font-size', '18px');

    nameItem.mousePressed(() => {
      nameList.splice(index, 1);
      localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify(nameList));
      updateListUI();
    });

    nameText.parent(nameItem);
    removeX.parent(nameItem);
    nameItem.parent(listContainer);
  });
}

function startSimulation() {
  if (nameList.length === 0) {
    alert('Please add at least one name.');
    return;
  // Save names out here
  }

  localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify(nameList));
  orderedNames = [];
  turbs = [];

  // Hide UI
  nameInput.hide();
  addButton.hide();
  listContainer.hide();
  startButton.hide();
  backgroundContainer.hide();

  // Start canvas and simulation
  canvas.show();
  frameRate(60);
  imageMode(CENTER);
  angleMode(DEGREES);

  turbs = getTurbs(nameList);
  simulationStarted = true;
}

function restartSimulation() {
  rankingContainer.style('display', 'none');
  orderedNames = [];
  turbs = getTurbs(nameList);
  simulationStarted = true;
  loop();
}

function reloadKeepingNames() {
  localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify(nameList));
  window.location.reload();
}

function showRanking() {
  rankingContainer.html('<h2>🏁 Finish Order</h2>');
  orderedNames.forEach((name, index) => {
    let rankItem = createDiv(`${index + 1}. ${name}`);
    rankItem.style('margin', '6px 0');
    rankItem.parent(rankingContainer);
  });

  const buttonRow = createDiv();
  buttonRow.style('margin-top', '16px');
  buttonRow.style('display', 'flex');
  buttonRow.style('gap', '10px');
  buttonRow.style('justify-content', 'center');
  buttonRow.parent(rankingContainer);

  const restartButton = createButton('Restart');
  restartButton.mousePressed(restartSimulation);
  restartButton.style('padding', '10px 14px');
  restartButton.style('border', 'none');
  restartButton.style('border-radius', '8px');
  restartButton.style('background-color', '#00796b');
  restartButton.style('color', 'white');
  restartButton.style('cursor', 'pointer');
  restartButton.parent(buttonRow);

  const reloadButton = createButton('Back');
  reloadButton.mousePressed(reloadKeepingNames);
  reloadButton.style('padding', '10px 14px');
  reloadButton.style('border', 'none');
  reloadButton.style('border-radius', '8px');
  reloadButton.style('background-color', '#37474f');
  reloadButton.style('color', 'white');
  reloadButton.style('cursor', 'pointer');
  reloadButton.parent(buttonRow);

  rankingContainer.style('display', 'block');
  setTimeout(() => rankingContainer.style('opacity', '1'), 50);
}

function draw() {
  
  NOISELEVEL = speedSlider.value();
  let multiplier = (NOISELEVEL / 160).toFixed(1);
  sliderLabel.html(`Speed: ${multiplier}x`);
  
  if (!simulationStarted) return;
  
  background(220);
  for (let turb of turbs) {
    turb.update();
    if (turb.finished && !orderedNames.includes(turb.name)) {
      orderedNames.push(turb.name);
    }
  }

  if (orderedNames.length === nameList.length) {
    print("Finished! Order is: ", orderedNames);
    rankingContainer.style('opacity', '0');
    rankingContainer.style('transition', 'opacity 0.8s ease');
    showRanking();
    noLoop();
  }
}
