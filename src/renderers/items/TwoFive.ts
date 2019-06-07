import Victor from 'victor';
import Mixin, { Options } from '../Mixin';

interface MoverArgs {
  width: number;
  height: number;
  mass: number;
  x: number;
  y: number;
};

interface LiquidArgs {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};


class Liquid {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  /**
   * Coefficient of drag
   */
  public dragAmount: number;

  constructor({ x, y, width, height }: LiquidArgs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dragAmount = 0.2;
  }

  public update({ x, y, width, height }: LiquidArgs) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Mover {
  public location: Victor;
  public velocity: Victor;
  private acceleration: Victor;
  public mass: number; 
  private canvasWidth: number;
  private canvasHeight: number;

  constructor({ width, height, mass, x, y }: MoverArgs) {
    this.location = new Victor(x, y);
    this.velocity = new Victor(0, 0);
    this.acceleration = new Victor(0, 0);
    this.mass = mass;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  public applyForce(force: Victor): void { // force = mass x acceleration. Newtons' second law
    const appliedForce = force.clone().divideScalar(this.mass);
    this.acceleration.add(appliedForce); 
  }

  public update(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  
    this.velocity.add(this.acceleration); // motion 101
    this.location.add(this.velocity);

    this.acceleration.multiplyScalar(0); // resets the acceleration to 0
  }

  public isInside(l: Liquid) {
    const { location } = this;
    return (
      location.x > l.x && 
      location.x < l.x + l.width &&
      location.y > l.y &&
      location.y < l.y + l.height
    );
  }

  public drag(l: Liquid) {
    const speed = this.velocity.magnitude();
    const dragMagnitude = speed * speed * l.dragAmount;

    const drag = this.velocity
      .clone()
      .multiplyScalar(-1)
      .normalize()
      .multiplyScalar(dragMagnitude);

    this.applyForce(drag);
  }

  public checkEdges(): void {
    const { canvasWidth, canvasHeight, mass, location, velocity } = this;

    if (location.x + mass > canvasWidth) {
      location.x = 0 + mass;
    }


    if (location.y + mass > canvasHeight) {
      location.y = canvasHeight - mass;
      velocity.multiplyScalarY(-1);
    } else if (location.y - mass < 0) {
      location.y = 0 + mass;
      velocity.multiplyScalarY(-1);
    }
  }

  public display(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.arc(this.location.x, this.location.y, this.mass, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }



}

export default class TwoFive extends Mixin {
  private balls: Mover[];
  private water: Liquid;

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();

    this.water = new Liquid({
      width,
      x: 0,
      y: height - 500,
      height: 500,
    });

    this.balls = Array.from(new Array(10)).map(() => {
      const mass = getRandomInt(5, 20);
      const x = getRandomInt(0 + mass, width - mass);
      const y = getRandomInt(0 + mass, (height - 500) - mass);

      return new Mover({
        width,
        height,
        mass,
        x,
        y,
      });
    }); 
  }

  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();

    ctx.clearRect(0, 0, width, height);

    this.water.display(ctx);

    this.balls.forEach((ball) => {
      const gravity = new Victor(0, 0.4 * ball.mass);

      ball.applyForce(gravity);

      if (ball.isInside(this.water)) {
        ball.drag(this.water);
      }
      // ball.applyForce(acceleration);
      // ball.applyForce(friction);

      // ball.applyForce(gravity);
      ball.update(width, height);
      ball.display(ctx);
      ball.checkEdges();
    });

    this.queueRaf();
  }
}
