import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Inicializar el puntaje
    this.ladrillos = 0;

    // Crear texto para mostrar el puntaje
    this.ladrillosText = this.add.text(16, 16, `ladrillos: ${this.ladrillos}`, {
      fontSize: '32px',
      fill: '#fff'
    });

    // Crear pala como rectángulo
    this.paddle = this.add.rectangle(400, 500, 100, 20, 0x6666ff);
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.paddle.body.setCollideWorldBounds(true);

    // Crear bola como círculo
    this.ball = this.add.circle(400, 300, 10, 0xff6666);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setVelocity(200, 200);

    // Configurar para que la pala no sea afectada por la gravedad
    this.paddle.body.setAllowGravity(false);

    // Agregar colisiones
    this.physics.add.collider(this.paddle, this.ball, null, null, this);

    // Detectar colisión con el límite inferior del mundo
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (down) {
        console.log("hit bottom");
        this.scene.start("GameOver");
      }
    });

    // Mover la pala con el cursor del mouse
    this.input.on('pointermove', (pointer) => {
      this.paddle.x = Phaser.Math.Clamp(pointer.x, this.paddle.width / 2, this.scale.width - this.paddle.width / 2);
    });

    // Crear un contenedor para los ladrillos
    this.brickContainer = this.add.container();
    this.bricks = [];  // Mantener una referencia a los ladrillos

    // Añadir múltiples ladrillos al contenedor en una cuadrícula, con solo dos filas
    for (let row = 0; row < 2; row++) {  // Cambiar de 3 a 2 para eliminar la fila superior
      for (let col = 0; col < 7; col++) {
        let x = 140 + col * 80;  // Mover ligeramente hacia la derecha
        let y = 250 + row * 40;  // Posicionar más abajo en la pantalla
        let brick = this.add.rectangle(x, y, 60, 20, 0x66ff66);
        this.physics.add.existing(brick);
        
        // Asegurarse de que los ladrillos no sean afectados por la gravedad y no se muevan
        brick.body.setImmovable(true);
        brick.body.setAllowGravity(false);
        this.brickContainer.add(brick);
        this.bricks.push(brick);  // Agregar el ladrillo al array de ladrillos
      }
    }

    // Agregar colisiones entre la bola y los ladrillos
    this.physics.add.collider(this.ball, this.brickContainer.list, this.handleCollision, null, this);
    }
    handleCollision(ball, brick) {
        console.log("collision");
        brick.destroy();
        
        // Incrementar el puntaje
        this.ladrillos += 1;
        this.ladrillosText.setText(`ladrillos: ${this.ladrillos}`);
    
        // Comprobar si todos los ladrillos han sido destruidos
        if (this.brickContainer.list.length === 0) {
          // Aumentar la velocidad de la pelota en un 10%
          let velocity = this.ball.body.velocity;
          this.ball.body.setVelocity(velocity.x * 1.1, velocity.y * 1.1);
    
          // Reiniciar la escena
          this.scene.restart();
        }
      }
}
