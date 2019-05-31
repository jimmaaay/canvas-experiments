import Victor from 'victor';
import Mixin, { Options } from '../Mixin';

interface MoverArgs {
  width: number;
  height: number;
  mass: number;
  x: number;
  y: number;
}


const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

class Mover {
  public location: Victor;
  private velocity: Victor;
  private acceleration: Victor;
  private mass: number; 
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

  public checkEdges(): void {
    const { canvasWidth, canvasHeight, mass, location, velocity } = this;

    // if (location.x + mass > canvasWidth) {
    //   location.x = canvasWidth - mass;
    //   velocity.multiplyScalarX(-1);
    // } else if (location.x - mass < 0) {
    //   location.x = 0 + mass;
    //   velocity.multiplyScalarX(-1);
    // }

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
    ctx.arc(this.location.x, this.location.y, this.mass, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }



}

export default class Basic extends Mixin {

  private balls: Mover[];

  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();
    this.balls = Array.from(new Array(10)).map(_ => {
      const mass = getRandomInt(5, 100);
      const x = getRandomInt(0 + mass, mass * 3);
      const y = getRandomInt(0 + mass, mass * 3);
      return new Mover({
        x,
        y,
        mass,
        width,
        height,
      });
    });
  }
  
  public draw(): void {
    
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();
    const gravity = new Victor(0, 1);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.clearRect(0, 0, width, height);

    this.balls.forEach((ball) => {
      const leftOriginatingWind = new Victor(4, 0);
      const rightOriginatingWind = new Victor(-4, 0);
      const percentageToRight = ball.location.x / width;
      const percentageToLeft = 1 - percentageToRight;
      
      // Closer the object is to the wind source the more powerful it is
      rightOriginatingWind.multiplyScalarX(percentageToRight);
      leftOriginatingWind.multiplyScalarX(percentageToLeft);
      
      ball.applyForce(leftOriginatingWind);
      ball.applyForce(rightOriginatingWind);
      ball.applyForce(gravity);
      ball.update(width, height);
      ball.display(ctx);
      ball.checkEdges();
    });

    this.queueRaf();
  }
}
