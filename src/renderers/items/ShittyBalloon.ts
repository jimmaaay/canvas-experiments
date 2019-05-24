import Mixin, { Options } from '../Mixin';
import Vector from '../../Vector';
import { getRandomNumber } from '../../helpers';

class Mover {

  public location: Vector;
  public velocity: Vector;
  public acceleration: Vector;
  private ballRadius: number;

  constructor({ canvasWidth, canvasHeight, ballRadius }: any) {
    this.ballRadius = ballRadius;

    const startX = canvasWidth / 2;
    const startY = canvasHeight;

    this.location = new Vector(startX, startY);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
  }

  public update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(-10, 10);
    this.location.add(this.velocity);

    // Clears the current acceleration
    this.acceleration.mult(0);
  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.ballRadius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  public applyForce(force: Vector) {
    this.acceleration.add(force);
  }
}


export default class ShittyBalloon extends Mixin {
 private balloon: Mover;

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();
    // this.mouse = new Vector(0, 0);

    this.balloon = new Mover({
      canvasWidth: width,
      canvasHeight: height,
      ballRadius: 20,
    });

  }


  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    const gravity = new Vector(0, 0.5);
    const helium = new Vector(0, -1);
    

    this.balloon.applyForce(gravity);
    this.balloon.applyForce(helium);

    // Yeah I know this is horrible
    if (this.balloon.location.y <= height / 2) {
      const windowForce = Vector.mult(
        Vector.add(Vector.add(this.balloon.velocity, gravity), helium),
        -1
      );
      this.balloon.applyForce(windowForce);
    }
    this.balloon.update();
    this.balloon.display(ctx);

    this.queueRaf();
  }
}
