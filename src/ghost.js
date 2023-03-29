class Ghost {
  constructor(grid, pos, color) {
    this.x = grid.cells[pos[0]][pos[1]].x + grid.cells[pos[0]][pos[1]].w / 2;
    this.y = grid.cells[pos[0]][pos[1]].y + grid.cells[pos[0]][pos[1]].h / 2;

    this.grid = grid;

    this.color = color;
    this.r = data.ghostSize;

    this.controlls = new Controlls((false));
    this.dir = "n";
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

    dt = dt || 0;

    switch (this.dir) {
      case "u":
        this.y -= data.ghostSpeed * dt;
        break;
      case "d":
        this.y += data.ghostSpeed * dt;
        break;
      case "l":
        this.x -= data.ghostSpeed * dt;
        break;
      case "r":
        this.x += data.ghostSpeed * dt;
        break;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
