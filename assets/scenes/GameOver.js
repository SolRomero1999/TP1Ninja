export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init() {}
  
    preload() {}
  
    create() {
      this.textoGanador = this.add.text(400, 400, "Has Perdido", {
        fontSize: "40px",
        fill: "#FFFFFF",
      });
    }
  
    update() {}
  }