import {
  TRIANGULO,
  CUADRADO,
  ROMBO,
  SHURIKEN,
  SHAPES,
  Player_Movement,
  SHAPE_DELAY,
  TIMER, 
  TIMER_DELAY, 
  POINTS_PERCENTAGE,
  POINTS_PERCENTAGE_VALUE_START,
} from "../../utilidades.js"; //Se exportan las constantes establecidas en utilidades 

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.objetos = {
      ["Triangulo"]: { count: 0, score: 20 },
      ["Cuadrado"]: { count: 0, score: 15 },
      ["Rombo"]: { count: 0, score: 10 },
      ["Shuriken"]: { count: 0, score: 20 },
    };
      this.isWinner = false;
      this.isGameOver = false;
      this.puntos = 0;
      this.Platform_Movement = 250; 
      this.plataformaMovible;
      this.timer = TIMER; 
    } //inicialización de cada objeto

  preload() {
      this.load.image("Cielo", "assets/images/Cielo.png");
      this.load.image("Ninja", "assets/images/Ninja.png");
      this.load.image("Plataforma", "assets/images/platform.png");
      this.load.image(ROMBO, "assets/images/Rombo.png");
      this.load.image(TRIANGULO, "assets/images/Triangulo.png");
      this.load.image(CUADRADO, "assets/images/Cuadrado.png");
      this.load.image(SHURIKEN, "assets/images/Shu.png");
    } //donde esta ubicada la imagen 

    create() {
      this.add.image(400, 300, "Cielo").setScale(0.555); //Se agrega la imagen Cielo en la posición (400, 300) escalada
      this.player = this.physics.add.sprite(400, 500, "Ninja"); //Se agrega un sprite en la posición (200, 300)
      this.player.setCollideWorldBounds(true); //hace que el sprite no pueda salir del mundo del juego
      this.plataformas = this.physics.add.staticGroup(); //Se crea el grupo de objetos estáticos llamado "plataformas"
      this.plataformas.create(400, 568, "Plataforma").setScale(2).refreshBody(); //se agrega una plataforma estática en la posición (400, 568) y se escala al doble de su tamaño original
      this.plataformaMovible = this.physics.add.staticGroup(); //Se crea otro grupo de objetos estáticos llamado "plataformaMovible"
      this.plataformaMovible = this.physics.add 
        .image(400, 400, "Plataforma")
        .setScale(0.55); //se agrega una plataforma móvil en la posición (400, 400) y se escala la imagen
      this.plataformaMovible.setImmovable(true); //hace que la plataforma no pueda moverse por la física del juego
      this.plataformaMovible.body.allowGravity = false; //desactiva la gravedad para la plataforma
      this.plataformaMovible.setVelocityX(250); //establece la velocidad horizontal de la plataforma en 250
      this.plataformaMovible.setCollideWorldBounds(false); //hace que la plataforma pueda salir del mundo del juego

      this.shapeGroup = this.physics.add.group(); //Se crea un grupo de objetos llamado "shapeGroup"

      this.physics.add.collider(this.player, this.plataformas);
      //this.physics.add.collider(this.plataformaMovible, this.shapeGroup);
      this.physics.add.collider(this.plataformaMovible, this.shapeGroup, (plataforma, shape) => {
        plataforma.setVelocityX(250);
      });

      this.physics.add.collider(this.player, this.plataformaMovible); //Se agregan colisiones entre los elementos del juego

      //SEGUNDA PLATAFORMA 
      this.otraPlataformaMovible = this.physics.add.image(400, 200, "Plataforma").setScale(0.55);
      this.otraPlataformaMovible.setImmovable(true);
      this.otraPlataformaMovible.body.allowGravity = false;
      this.otraPlataformaMovible.setVelocityX(-250); //se establece la velocidad horizontal negativa
      this.otraPlataformaMovible.setCollideWorldBounds(false);


      //this.physics.add.collider(this.otraPlataformaMovible, this.shapeGroup);
      this.physics.add.collider(this.otraPlataformaMovible, this.shapeGroup, (plataforma, shape) => {
        plataforma.setVelocityX(-250);
      });

      this.physics.add.collider(this.player, this.otraPlataformaMovible);


    
      this.physics.add.overlap( //agrega una comprobación de superposición entre dos objetos
        this.player, //primer objeto a comprobar
        this.shapeGroup, //segundo objeto a comprobar 
        this.collectShape, //función que se ejecuta si hay superposición 
        null,
        this
      );

      this.cursors = this.input.keyboard.createCursorKeys(); //funcionalidad de las flechas

      this.rebote = this.physics.add.collider( 
          this.shapeGroup,
          this.plataformas,
          this.reduce,
          null,
          this
        ); //agrega colisión entre las formas y las plataformas 

     //enevto nueva forma 
      this.time.addEvent({ //crea un nuevo evento cronometrado
          delay: SHAPE_DELAY, //frecuencia con la que se ejecutará el evento
          callback: this.addShape, //nombre de la función que se ejecutará cada vez que se active el evento
          callbackScope: this, //objeto al que se le aplicará la función de callback
          loop: true, //el evento se ejecutará de forma continua
        });

    //evento contador
    this.time.addEvent({ 
      delay: TIMER_DELAY,
      callback: this.contador,
      callbackScope: this,
      loop: true,
    }); 

    //Texto contador 
    this.textoTemporizador = this.add.text(10, 10, "Tiempo:  " + this.timer, { //posición y texto 
      fontSize: "25px", //tamaño 
      fill: "#FFFFFF", //color letra 
      backgroundColor: "#000000" //color fondo 
    });

    //Texto formas 
    this.scoreText = this.add.text(260, 10, "Triángulo: 0/ Cuadrado: 0/ Rombo: 0", {  
      fontSize: "25px",
      fill: "#FFFFFF",
      backgroundColor: "#000000"
    });   
    
    //Texto puntaje 
    this.textoPuntaje = this.add.text(10, 40, "Puntaje: 0", { 
      fontSize: "25px", 
      fill: "#FFFFFF", 
      backgroundColor: "#000000"  
    });
    
  }

  update() {

        if (this.plataformaMovible.x >= 700) { //si la plataforma ha llegado al límite derecho del juego
          this.plataformaMovible.setVelocityX(-this.Platform_Movement); //La velocidad negativa hace que la plataforma se mueva en la dirección opuesta al eje x
        }
        if (this.plataformaMovible.x <= 100) { // la plataforma ha llegado al límite izquierdo del juego
          this.plataformaMovible.setVelocityX(this.Platform_Movement); //La velocidad positiva hace que la plataforma se mueva en la dirección del eje x
        }

        if (this.otraPlataformaMovible.x >= 700) { //si la plataforma ha llegado al límite derecho del juego
          this.otraPlataformaMovible.setVelocityX(-this.Platform_Movement); //La velocidad negativa hace que la plataforma se mueva en la dirección opuesta al eje x
        }
        if (this.otraPlataformaMovible.x <= 100) { // la plataforma ha llegado al límite izquierdo del juego
          this.otraPlataformaMovible.setVelocityX(this.Platform_Movement); //La velocidad positiva hace que la plataforma se mueva en la dirección del eje x
        }
        
        if (this.cursors.left.isDown) { //si la tecla de flecha izquierda se encuentra presionada
          this.player.setVelocityX(-Player_Movement.x); //se establece la velocidad horizontal del jugador en una cantidad negativa

        } else if (this.cursors.right.isDown) { //si la tecla de flecha derecha está presionada
          this.player.setVelocityX(Player_Movement.x); //se establece la velocidad horizontal del jugador en una cantidad positiva

        } else { //si ninguna de las teclas de flecha está presionada
          this.player.setVelocityX(0); //la velocidad horizontal del jugador en cero
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) { //si la tecla de flecha arriba está presionada el jugador está tocando el suelo
          this.player.setVelocityY(-Player_Movement.y); //la velocidad vertical del jugador se establece en una cantidad negativa, lo que hace que el jugador salte hacia arriba
        }

        if (this.isWinner) {
          this.scene.start("winner");
        }
        if (this.isGameOver) {
          this.scene.start("gameOver");
        }
        if (this.timer === 0 && !this.isWinner) {
          this.isGameOver = true;
        }        

      }

        addShape() {
          const randomShape = Phaser.Math.RND.pick([TRIANGULO, CUADRADO, ROMBO, SHURIKEN]);
          const randomX = Phaser.Math.RND.between(0, 800);
          this.shapeGroup.create(randomX, 0, randomShape)
            .setCircle(32, 0, 0)
            .setBounce(0.8)
            .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);
          console.log("shape is added", randomX, randomShape);
        }

      //RECOLECTAR FORMA  
      collectShape(player, shape) { //Esta es una función que se ejecuta cuando el jugador choca con una figura y la remueve de pantalla
          console.log("figura recolectada"); //Imprime un mensaje en la consola para indicar que la figura fue recogida
          shape.disableBody(true, true); //Desactiva la figura y la elimina del cuerpo físico
          const shapeName = shape.texture.key; //Obtiene el nombre de la figura recogida

          this.objetos[shapeName].count++; //Esta línea incrementa el contador de la figura que se ha recogido
          this.puntosTriangulo = this.objetos[TRIANGULO].count * this.objetos[TRIANGULO].score;
          this.puntosCuadrado = this.objetos[CUADRADO].count * this.objetos[CUADRADO].score;
          this.puntosRombo = this.objetos[ROMBO].count * this.objetos[ROMBO].score;    
          this.puntosShuriken = this.objetos[SHURIKEN].count * this.objetos[SHURIKEN].score;      
          this.puntos = this.puntosTriangulo + this.puntosCuadrado + this.puntosRombo - this.puntosShuriken;

          //ACTUALIZA EL TEXTO DE LAS FORMAS 
          this.scoreText.setText(
            "Triángulo: " + this.objetos[TRIANGULO].count +
            " Cuadrado: " + this.objetos[CUADRADO].count +
            " Rombo: " + this.objetos[ROMBO].count
          );

          this.textoPuntaje.setText(
            "Puntaje: " + this.puntos
          );
      
          //CONDICIÓN PARA GANAR 
          if (
            this.objetos[TRIANGULO].count >= 2 &&
            this.objetos[CUADRADO].count >= 2 &&
            this.objetos[ROMBO].count >= 2 &&
            this.puntos >= 100
          ) {
            this.isWinner = true;
          }      

      }

      contador() {
        console.log(this.timer); // Imprime en la consola el valor actual del timer
        this.timer--; // Disminuye el valor del timer en 1
        console.log(this.timer); // Imprime en la consola el nuevo valor del timer
        this.textoTemporizador.setText("Tiempo: " + this.timer); // Actualiza el texto del temporizador con el nuevo valor del timer
      }    
      
      reduce(shape, platform){
        const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
        console.log(shape.texture.key, newPercentage);
        shape.setData(POINTS_PERCENTAGE, newPercentage);
        if (newPercentage <= 0) {
          shape.disableBody(true, true);
          return;
        }

    // TEXTO DISMINUCIÓN PUNTOS FORMA
    const text = this.add.text(shape.body.position.x+10, shape.body.position.y, "- 25%", {
      fontSize: "22px",
      fontStyle: "bold",
      fill: "red",
    });
    setTimeout(() => {
      text.destroy();
    }, 200);
  }
    
      
}