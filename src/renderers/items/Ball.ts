import Mixin, { Options } from '../Mixin';
import Vector from '../../Vector';

const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}

class Mover {
  private location: Vector;
  private velocity: Vector;
  private acceleration: Vector;
  private canvasWidth: number;
  private canvasHeight: number;
  private ballRadius: number;

  constructor({ canvasWidth, canvasHeight, ballRadius }: any) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.ballRadius = ballRadius;

    this.location = new Vector(canvasWidth / 2, canvasHeight / 2);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0.1, 0.2);
  }

  public update(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.acceleration.x = getRandomNumber(-0.2, 0.2);
    this.acceleration.y = getRandomNumber(-0.2, 0.2);
    this.velocity.add(this.acceleration);
    this.velocity.limit(10);
    this.location.add(this.velocity);
  }

  public checkEdges() {
    if (this.location.x + this.ballRadius > this.canvasWidth) {
      this.location.x = 0 + this.ballRadius;
    }

    if (this.location.x - this.ballRadius < 0) {
      this.location.x = this.canvasWidth - this.ballRadius;
    }

    if (this.location.y + this.ballRadius > this.canvasHeight) {
      this.location.y = 0 + this.ballRadius;
    }

    if (this.location.y - this.ballRadius < 0) {
      this.location.y = this.canvasHeight - this.ballRadius;
    }

  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.ballRadius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
}


export default class Ball extends Mixin {
 private mover: Mover;

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();
    this.mover = new Mover({
      canvasWidth: width,
      canvasHeight: height,
      ballRadius: 50,
    });
  }


  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();

    ctx.clearRect(0, 0, width, height);

    this.mover.update(width, height);
    this.mover.checkEdges();
    this.mover.display(ctx);

    this.queueRaf();
  }
}
