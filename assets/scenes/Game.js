
export default class Game extends Phaser.Scene {
    constructor() {
      super("game");
    }

    preload() {
        this.load.image("Cielo", "assets/images/Cielo.png");
        this.load.image("Ninja", "assets/images/Ninja.png");
        this.load.image("Plataforma", "assets/images/platform.png");
      }

      init() {
        this.Platform_Movement = 250; 
        this.plataformaMovible;
      }

      create() {
        this.add.image(400, 300, "Cielo").setScale(0.555);
        this.player = this.physics.add.sprite(200, 300, "Ninja");
        this.player.setCollideWorldBounds(true);
        this.plataformas = this.physics.add.staticGroup();
        this.plataformas.create(400, 568, "Plataforma").setScale(2).refreshBody();
        this.plataformaMovible = this.physics.add.staticGroup();
        this.plataformaMovible = this.physics.add
          .image(400, 400, "Plataforma")
          .setScale(0.55);
        this.plataformaMovible.setImmovable(true);
        this.plataformaMovible.body.allowGravity = false;
        this.plataformaMovible.setVelocityX(250);
        this.plataformaMovible.setCollideWorldBounds(false);
        this.shapeGroup = this.physics.add.group();
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.collider(this.plataformaMovible, this.shapeGroup);
        this.physics.add.collider(this.player, this.plataformaMovible);
        this.physics.add.overlap(
          this.player,
          this.shapeGroup,
          this.collectShape,
          null,
          this
        );
    }

    update() {

        if (this.plataformaMovible.x >= 700) {
            this.plataformaMovible.setVelocityX(-this.Platform_Movement);
          }
          if (this.plataformaMovible.x <= 100) {
            this.plataformaMovible.setVelocityX(this.Platform_Movement);
          }
        }

}