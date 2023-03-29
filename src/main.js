const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let lastTime = 0;
const fps = 100;

const grid = new Grid(15, 15, canvas.width, canvas.height);
grid.makeGrid();

const p = new Pacman(grid);
const ghost = new Ghost(grid, [7, 8], "blue");

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  canvas.height = 600;

  grid.update(deltaTime);
  p.update(deltaTime);
  ghost.update(deltaTime);

  grid.draw(ctx);
  ghost.draw(ctx);
  p.draw(ctx);

  aStar(grid, getCurrentCell(grid, ghost), getCurrentCell(grid, p), 2);

  centerPlayer(grid, p, 10);

  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000 / fps);
}

animate();

function getCurrentCell(grid, player) {
  for (let i = 0; i < grid.rowCount; i++) {
    for (let j = 0; j < grid.colCount; j++) {
      if (
        player.x > grid.cells[i][j].x &&
        player.x < grid.cells[i][j].x + grid.cells[i][j].w &&
        player.y > grid.cells[i][j].y &&
        player.y < grid.cells[i][j].y + grid.cells[i][j].w
      ) {
        return grid.cells[i][j];
      }
    }
  }
}

function centerPlayer(grid, player) {
  let cell = getCurrentCell(grid, player);

  if (player.dir === "r" || player.dir === "l") {
    player.y = cell.y + cell.h / 2;
  }
  if (player.dir === "u" || player.dir === "d") {
    player.x = cell.x + cell.w / 2;
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

function aStar(grid, start, end, h) {
  let current = start;
  let fullPath = [start];
  let openSet = [start];
  let closedSet = [];
  let neighbors = [];
  let lowestF = 100000;

  start.color = "red";
  end.color = "blue";

  for (let i = 0; i < 30; i++) {
    if (current !== end) {
      // Lägger till alla raka grannar
      current.i !== 0 && neighbors.push(grid.cells[current.i - 1][current.j]);
      current.j !== grid.rowCount &&
        neighbors.push(grid.cells[current.i + 1][current.j]);
      current.j !== 0 && neighbors.push(grid.cells[current.i][current.j - 1]);
      current.j !== grid.colCount &&
        neighbors.push(grid.cells[current.i][current.j + 1]);

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        openSet.push(neighbor);
        neighbor.f = Math.abs(neighbor.i - end.i + neighbor.j - end.j);
      }

      for (let i = 0; i < openSet.length; i++) {
        openSet[i].color = "green";
        if (openSet[i].f < lowestF) {
          closedSet.push(current);
          current = openSet[i];
          lowestF = openSet[i].f;
        }
      }

      for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].color = "red";
      }

      
    } else {
      return fullPath;
    }
  }
}
