const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let lastTime = 0;
const fps = data.fps;

const grid = new Grid(data.cols, data.rows, canvas.width, canvas.height);
grid.makeGrid();

const p = new Pacman(grid);
const ghost = new Ghost(grid, [10, 5], "blue");
const ghost1 = new Ghost(grid, [2, 13], "blue");

pathFind(grid, getCurrentCell(grid, ghost), getCurrentCell(grid, p));
pathFind(grid, getCurrentCell(grid, ghost1), getCurrentCell(grid, p));

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  canvas.height = 600;

  grid.update(deltaTime);
  p.update(deltaTime);
  ghost.update(deltaTime);
  ghost1.update(deltaTime);

  grid.draw(ctx);
  ghost.draw(ctx);
  ghost1.draw(ctx);
  p.draw(ctx);

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / fps);
}

animate();

function getCurrentCell(grid, obj) {
  for (let i = 0; i < grid.rowCount; i++) {
    for (let j = 0; j < grid.colCount; j++) {
      if (
        obj.x > grid.cells[i][j].x &&
        obj.x < grid.cells[i][j].x + grid.cells[i][j].w &&
        obj.y > grid.cells[i][j].y &&
        obj.y < grid.cells[i][j].y + grid.cells[i][j].w
      ) {
        return grid.cells[i][j];
      }
    }
  }
}

function inTurnZone(grid, player, d) {
  let cell = getCurrentCell(grid, player);

  if (
    Math.abs(
      Math.hypot(
        player.x - (cell.x + cell.w / 2),
        player.y - (cell.y + cell.h / 2)
      )
    ) < d
  ) {
    return true;
  }
  return false;
}

function checkForWall(grid, player, dir) {
  let cell = getCurrentCell(grid, player);

  switch (dir) {
    case "u":
      if (cell.j === 0 || grid.cells[cell.i][cell.j - 1].wall) {
        return false;
      }
      break;
    case "d":
      if (cell.j === grid.rowCount - 1 || grid.cells[cell.i][cell.j + 1].wall) {
        return false;
      }
      break;

    case "l":
      if (cell.i === 0 || grid.cells[cell.i - 1][cell.j].wall) {
        return false;
      }
      break;

    case "r":
      if (cell.i === grid.colCount - 1 || grid.cells[cell.i + 1][cell.j].wall) {
        return false;
      }
      break;
  }
  return true;
}

function pathFind(grid, start, end) {
  let current = start;
  let winner = { cell: null, h: 100000 };

  if (current === end) {
    console.log("done");
    return;
  } else {
    let neighbors = getCellNeighbors(grid, current);

    for (let i = 0; i < neighbors.length; i++) {
      let h = heuristic(neighbors[i], end);

      if (h < winner.h) {
        winner = { cell: neighbors[i], h: h };
      }
    }
    winner.cell.color = "blue";
  }
  pathFind(grid, winner.cell, end);
}

// Subfunctions för A*

function getCellNeighbors(grid, cell) {
  let neighbors = [];

  cell.i !== 0 && neighbors.push(grid.cells[cell.i - 1][cell.j]);
  cell.j !== grid.rowCount && neighbors.push(grid.cells[cell.i + 1][cell.j]);
  cell.j !== 0 && neighbors.push(grid.cells[cell.i][cell.j - 1]);
  cell.j !== grid.colCount && neighbors.push(grid.cells[cell.i][cell.j + 1]);

  return neighbors;
}

function removeFromArrey(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function dist(x1, y1, x2, y2) {
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);

  let d = Math.sqrt(dx * dx + dy * dy);

  return d;
}

function heuristic(a, b) {
  let d = dist(a.x, a.y, b.x, b.y);
  return d;
}
