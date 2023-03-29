class Grid {
  constructor(cols, rows, width, height) {
    this.rowCount = rows;
    this.colCount = cols;

    this.height = height;
    this.width = width;

    this.cells = new Array(this.rowCount);
  }

  makeGrid() {
    for (let i = 0; i < this.rowCount; i++) {
      this.cells[i] = new Array(this.colCount);
      for (let j = 0; j < this.colCount; j++) {
        this.cells[i][j] = new Cell(
          i,
          j,
          this.width / this.rowCount,
          this.height / this.colCount,
          Math.random() < data.wallPercentage
        );
      }
    }
  }

  update(dt) {
    dt = dt || 0;

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        this.cells[i][j].update(dt);
      }
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.colCount; j++) {
        this.cells[i][j].draw(ctx);
      }
    }
  }
}
