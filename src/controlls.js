let inp = 0;

class Controlls {
  constructor(keys = true) {
    this.keys = keys;
    this.output = "n";
  }

  #getinput() {
    switch (inp) {
      case 38:
        this.output = "u";
        break;
      case 40:
        this.output = "d";
        break;
      case 37:
        this.output = "l";
        break;
      case 39:
        this.output = "r";
        break;
      case 32:
        this.output = "n";
        break;
    }
  }

  #aStar() {}

  move() {
    if (this.keys) {
      this.#getinput();
    } else {
      this.#aStar();
    }
  }
}

document.addEventListener("keydown", function (event) {
  inp = event.keyCode;
});
