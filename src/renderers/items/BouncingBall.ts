import Mixin, { Options } from '../Mixin';

class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  public limitX(max: number, min: number) {
    if (this.x > max) this.x = max;
    if (this.x < min) this.x = min;
  }

}

export default class BouncingBall extends Mixin {
  private location: Vector;
  private velocity: Vector;
  private acceleration: Vector;

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();
    this.location = new Vector(width / 2, height / 2);
    this.velocity = new Vector(3, 3);
    this.acceleration = new Vector(0.1, 0);
  }

  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();
    const ballRadius = 50;

    ctx.clearRect(0, 0, width, height);

    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    if (
      this.location.x + ballRadius > width || 
      this.location.x - ballRadius < 0
    ) {
      this.velocity.x *= -1;
      this.acceleration.x *= -1;
    } 

    if (
      this.location.y + ballRadius > height || 
      this.location.y - ballRadius < 0
    ) {
      this.velocity.y *= -1;
      this.acceleration.y *= -1;
    }

    this.velocity.limitX(50, -50);

    ctx.beginPath();
    ctx.moveTo(this.location.x, this.location.y);
    ctx.arc(this.location.x, this.location.y, ballRadius, 0, Math.PI * 2, false);
    ctx.fill();

    this.queueRaf();
  }
}
