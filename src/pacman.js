class Pacman {
  constructor(grid) {
    this.x = grid.cells[0][0].x + grid.cells[0][0].w / 2;
    this.y = grid.cells[0][0].y + grid.cells[0][0].h / 2;

    this.r = data.playerSize;

    this.grid = grid;

    this.controlls = new Controlls();
    this.dir = "n";

    this.score = 0;
  }

  #move() {
    this.controlls.move();

    if (
      !checkForWall(this.grid, this, this.dir) &&
      inTurnZone(this.grid, this, data.turnZoneRadius)
    ) {
      this.dir = "n";
    }

    if (
      checkForWall(this.grid, this, this.controlls.output) &&
      inTurnZone(this.grid, this, data.turnZoneRadius)
    ) {
      this.dir = this.controlls.output;
    }
  }

  update(dt) {
    this.#move();

    let cell = getCurrentCell(this.grid, this);

    dt = dt || 0;

    switch (this.dir) {
      case "u":
        this.y -= data.playerSpeed * dt;
        break;
      case "d":
        this.y += data.playerSpeed * dt;
        break;
      case "l":
        this.x -= data.playerSpeed * dt;
        break;
      case "r":
        this.x += data.playerSpeed * dt;
        break;
    }

    if (cell.food) {
      cell.food = false;
      this.score++;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }
}
