const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let lastTime = 0;
const fps = data.fps;

const grid = new Grid(data.cols, data.rows, canvas.width, canvas.height);
grid.makeGrid();

const p = new Pacman(grid);
const ghost = new Ghost(grid, [1, 1], "blue");

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

// function centerPlayer(grid, player) {
//   let cell = getCurrentCell(grid, player);

//   if (player.dir === "r" || player.dir === "l") {
//     player.y = cell.y + cell.h / 2;
//   }
//   if (player.dir === "u" || player.dir === "d") {
//     player.x = cell.x + cell.w / 2;
//   }
// }

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

// function aStar(grid, start, end) {
//   let current = start;
//   let fullPath = [];
//   let openSet = [start];
//   let closedSet = [];
//   let neighbors = [];
//   let done = false;
//   let newPath = true;

//   end.color = "blue";

//   if (openSet.length > 0 && !done) {
//     let winner = 0;

//     for (let i = 0; i < openSet.length; i++) {
//       openSet[i].color = "green";
//       if (openSet[i].f < openSet[winner].f) {
//         winner = i;
//       }
//     }

//     current = openSet[winner];

//     if (current === end) {
//       let temp = current;

//       fullPath.push(temp);

//       while (temp.parent) {
//         fullPath.push(temp.parent);
//         temp = temp.parent;
//       }

//       done = true;
//       console.log(fullPath);
//       console.log("done");
//     }

//     removeFromArrey(openSet, current);
//     closedSet.push(current);
//   }

//   // Lägger till alla raka grannar
//   neighbors = getCellNeighbors(grid, current);

//   for (let i = 0; i < neighbors.length; i++) {
//     let neighbor = neighbors[i];

//     if (!closedSet.includes(neighbor) && !neighbor.wall) {
//       let tempG = current.g + 1;

//       newPath = false;

//       if (openSet.includes(neighbor)) {
//         if (tempG < neighbor.g) {
//           neighbor.g = tempG;
//           newPath = true;
//         }
//       } else {
//         neighbor.g = tempG;
//         newPath = true;
//         openSet.push(neighbor);
//       }

//       if (newPath) {
//         neighbor.h = heuristic(neighbor, end);
//         neighbor.f = neighbor.g + neighbor.h;
//         neighbor.parent = current;
//       }
//     }
//   }

//   for (let i = 0; i < openSet.length; i++) {
//     openSet[i].color = "green";
//   }

//   for (let i = 0; i < closedSet.length; i++) {
//     closedSet[i].color = "red";
//   }
// }

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

function pathFind(grid, current, end) {
  current = current;

  neighbors = getCellNeighbors(grid, current);

  for (let i = 0; i < neighbors.length; i++) {
    let neighbor = neighbors[i];

    if (!neighbor.wall) {
      let h = heuristic(neighbor, end);
      let tempG = current.g + 1;

      if (tempG < neighbor.g) {
        neighbor.g = tempG;
        openSet.push(neighbor);
      }
    }
  }
}
