import Victor from 'victor';
import Mixin, { Options } from '../Mixin';


interface AttractorArgs {
  mass: number;
  canvasWidth: number;
  canvasHeight: number;
  x: number;
  y: number;
}

interface MoverArgs {
  mass: number;
  x: number;
  y: number;
  // canvasWidth: number;
  // canvasHeight: number;
}


const END_ANGLE = Math.PI * 2;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const GRAVITATIONAL_CONSTANT = 1;

class Attractor {
  private mass: number;
  private location: Victor;

  constructor(args: AttractorArgs) {
    const { canvasHeight, canvasWidth, mass, x, y } = args;
    this.mass = mass;
    this.location = new Victor(x, y);
  }

  private constrain(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  public attract(mover: Mover) {
    const MAX_DISTANCE = 100;
    const DISTANCE_MODIFIER = 10;
    const force = this.location.clone().subtract(mover.location);
    const distance = this.constrain(force.magnitude(), 2, MAX_DISTANCE); // current distance between items
    force.normalize();
    let distanceModifier = (distance / MAX_DISTANCE) * DISTANCE_MODIFIER;
    if (distance < 20) {
      distanceModifier = -5;
    }
    const strength = ((GRAVITATIONAL_CONSTANT * this.mass * mover.mass) / (distance * distance)) * distanceModifier;
    force.multiplyScalar(strength);
    return force;
  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.mass / 2, 0, END_ANGLE, false);
    ctx.fill();
    ctx.closePath();
  }
}

class Mover {
  public mass: number;
  public location: Victor;
  private velocity: Victor;
  private acceleration: Victor;

  // private canvasWidth: number;
  // private canvasHeight: number;

  constructor(args: MoverArgs) {
    const { mass, x, y } = args;
    this.mass = mass;
    this.location = new Victor(x, y);
    this.velocity = new Victor(7, -6);
    this.acceleration = new Victor(0, 0);
  }

  public applyForce(force: Victor): void { // force = mass x acceleration. Newtons' second law
    const appliedForce = force.clone().divideScalar(this.mass);
    this.acceleration.add(appliedForce);
  }

  public update() {

    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    this.acceleration.multiplyScalar(0); // resets the acceleration to 0
  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.mass, 0, END_ANGLE , false);
    ctx.fill();
  }
}


export default class TwoEight extends Mixin {
  private attractors: Attractor[];
  private movers: Mover[];


  constructor(props: Options) {
    super(props);
    const canvasHeight = this.getHeight();
    const canvasWidth = this.getWidth();

    this.attractors = Array.from(new Array(1)).map(() => {
      return new Attractor({
        canvasHeight,
        canvasWidth,
        mass: 50,
        x: canvasWidth / 2,
        y: canvasHeight / 2,
      });
    });

    this.movers = Array.from(new Array(1)).map(() => {
      return new Mover({
        x: getRandomInt(0, canvasWidth),
        y: getRandomInt(0 , canvasHeight),
        mass: 3,
      });
    });

  }

  public draw() {
    const { ctx } = this;
    const width = this.getWidth();
    const height = this.getHeight();

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    this.movers.forEach((mover) => {
      this.attractors.forEach((attractor) => {
        const gravityForce = attractor.attract(mover);
        mover.applyForce(gravityForce);
      });

      mover.update();
      mover.display(ctx);
    });

    this.attractors.forEach((attractor) => {
      attractor.display(ctx);
    });

    this.queueRaf();
  }
}
