function getTurbs(names) {
  let turbs = [];
  const cols = ceil(sqrt(names.length));
  const rows = ceil(names.length/cols);
  
  const cellW = width/cols;
  const cellH = height/rows;
  
  for (let i = 0; i < names.length; i++) {
    const row = floor(i / cols);
    const col = i % cols;

    const x = (col - (cols - 1) / 2) * cellW;
    const y = (row - (rows - 1) / 2) * cellH;

    turbs.push(new Turbine(x, y, cellW, cellH, names[i]));
  }
  return turbs;
}