class Cell {
  constructor(i, j, w, h, wall) {
    this.x = i * w;
    this.y = j * h;

    this.i = i;
    this.j = j;

    this.w = w;
    this.h = h;

    this.parent = undefined;
    this.f = 100000;
    this.g = 0;

    this.wall = wall;
    this.food = !wall;

    this.color = "white";
  }

  update(dt) {}

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    if (this.wall) {
      this.color = "grey";
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();

    if (this.food) {
      ctx.beginPath();
      ctx.arc(
        this.x + this.w / 2,
        this.y + this.h / 2,
        this.w / 15,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "black";
      ctx.fill();
    }
  }
}
