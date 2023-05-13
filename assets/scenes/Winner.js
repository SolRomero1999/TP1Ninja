export default class Winner extends Phaser.Scene {
    constructor() {
      super("winner");
    }
  
    init() {}
  
    preload() {}
  
    create() {
      this.textoGanador = this.add.text(400, 400, "Has Ganado", {
        fontSize: "40px",
        fill: "#FFFFFF",
      });
    }
    update() {}
  }
  