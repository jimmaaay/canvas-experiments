import Mixin, { Options } from '../Mixin';
import Vector from '../../Vector';
import { getRandomNumber } from '../../helpers';

class Mover {
  private location: Vector;
  private velocity: Vector;
  private acceleration: Vector;
  private mouse: Vector;
  private dir: Vector;
  private canvasWidth: number;
  private canvasHeight: number;
  private ballRadius: number;

  constructor({ canvasWidth, canvasHeight, ballRadius }: any) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.ballRadius = ballRadius;

    const middleX = canvasWidth / 2;
    const middleY = canvasHeight / 2;
    const startX = middleX + getRandomNumber(-100, 100);
    const startY = middleY + getRandomNumber(-100, 100);

    this.location = new Vector(startX, startY);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.mouse = new Vector(0, 0);
    this.dir = new Vector(0, 0);
  }

  public update(canvasWidth: number, canvasHeight: number, mouseVector: Vector) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.mouse = mouseVector;

    this.dir = Vector.sub(this.mouse, this.location);
    this.dir.normalize();
  
    this.acceleration = this.dir;
    this.velocity.add(this.acceleration);
    this.velocity.limit(-10, 10);
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
    ctx.stroke();
    ctx.closePath();
  }
}


export default class Ball extends Mixin {
 private balls: Mover[];
 private mouse: Vector;

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();
    this.mouse = new Vector(0, 0);

    this.balls = Array
      .from(new Array(30))
      .map(() => {
        return new Mover({
          canvasWidth: width,
          canvasHeight: height,
          ballRadius: 20,
        });
      });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse = new Vector(e.clientX, e.clientY);
    });
  }


  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';


    this.balls.forEach((ball) => {
      ball.update(width, height, this.mouse);
      ball.display(ctx);
    });

    this.queueRaf();
  }
}
