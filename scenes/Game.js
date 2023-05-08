export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    let objetos = [
      { type: "Triangulo", count: 0 },
      { type: "Cuadrado", count: 0 },
      { type: "Rombo", count: 0 },
    ];
  }

  preload() {
    this.load.image("Rombo", "assets/images/Rombo.png");
    this.load.image("Triangulo", "assets/images/Triangulo.png");
    this.load.image("Cuadrado", "assets/images/Cuadrado.png");
    this.load.image("Cielo", "assets/images/Cielo.png");
    this.load.image("Ninja", "assets/images/Ninja.png");
    this.load.image("Plataforma", "assets/images/platform.png");
  }

  create() {
    this.add.image(400, 300, "Cielo").setScale(0.555);
    //Con Fisicas

    this.player = this.physics.add.sprite(200, 300, "Ninja");

    this.plataformas = this.physics.add.staticGroup();
    this.plataformas.create(400, 568, "Plataforma").setScale(2).refreshBody();
    this.plataformas.create(600, 400, "Plataforma");

    this.shapeGroup = this.physics.add.group();
    this.shapeGroup.create(200, 0, "Triangulo");

    this.physics.add.collider(this.player, this.plataformas);
    this.physics.add.collider(this.plataformas, this.shapeGroup);
    this.physics.add.overlap(
      this.player,
      this.shapeGroup,
      this.collectShape,
      null,
      this
    );
    //this.collectshape es la funcion que llama cuando los dos parametros se superponen
  }

  update() {}

  collectShape(player, shape) {
    // la remueve de pantalla
    console.log("figura recolectada");
    shape.disableBody(true, true);
  }
}