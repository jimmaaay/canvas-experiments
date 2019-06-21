import Victor from 'victor';
import Mixin, { Options } from '../Mixin';


interface AttractorArgs {
  mass: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface MoverArgs {
  mass: number;
  x: number;
  y: number;
  // canvasWidth: number;
  // canvasHeight: number;
}

const GRAVITATIONAL_CONSTANT = 1;
const MAX_MOVER_TRAIL = 150;

class Attractor {
  private mass: number;
  private location: Victor;

  constructor(args: AttractorArgs) {
    const { canvasHeight, canvasWidth, mass } = args;
    this.mass = mass;
    this.location = new Victor(canvasWidth / 2, canvasHeight / 2);
  }

  public move(location: Victor) {
    this.location = location;
  }

  public isAtLocation(location: Victor) {
    const radius = this.mass / 2;
    return (
      location.x > this.location.x - radius
      && location.x < this.location.x + radius
      && location.y > this.location.y - radius
      && location.y < this.location.y + radius
    );
  }

  private constrain(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  public attract(mover: Mover) {
    const force = this.location.clone().subtract(mover.location);
    const distance = this.constrain(force.magnitude(), 5, 14); // current distance between items
    force.normalize();
    const strength = (GRAVITATIONAL_CONSTANT * this.mass * mover.mass) / (distance * distance);
    force.multiplyScalar(strength);
    return force;
  }

  public display(ctx: CanvasRenderingContext2D, isHoveredOver: boolean) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(128, 0, 128, ${isHoveredOver ? '0.8' : '0.3'})`;
    ctx.arc(this.location.x, this.location.y, this.mass / 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

class Mover {
  public mass: number;
  public location: Victor;
  private velocity: Victor;
  private acceleration: Victor;

  private previousCoords: number[][];

  // private canvasWidth: number;
  // private canvasHeight: number;

  constructor(args: MoverArgs) {
    const { mass, x, y } = args;
    this.mass = mass;
    this.location = new Victor(x, y);
    this.velocity = new Victor(7, -6);
    this.acceleration = new Victor(0, 0);
    this.previousCoords = [];
    // this.canvasHeight = canvasHeight;
    // this.canvasWidth = canvasWidth;
  }

  public applyForce(force: Victor): void { // force = mass x acceleration. Newtons' second law
    const appliedForce = force.clone().divideScalar(this.mass);
    this.acceleration.add(appliedForce);
  }

  public update() {
    this.previousCoords.push([
      this.location.x,
      this.location.y,
    ]);

    if (this.previousCoords.length > MAX_MOVER_TRAIL) {
      this.previousCoords.shift();
    }

    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);

    this.acceleration.multiplyScalar(0); // resets the acceleration to 0
  }

  public display(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 192, 203, 0.3)';
    ctx.arc(this.location.x, this.location.y, this.mass, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    this.previousCoords.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 192, 203, 0.3)';
      ctx.arc(x, y, 3, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    });
  }
}


export default class Gravity extends Mixin {
  private attractor: Attractor;
  private mover: Mover;

  private mouseDown: boolean;
  private mousePosition: number[];
  private mouseMovingAttractor: boolean;


  constructor(props: Options) {
    super(props);
    const canvasHeight = this.getHeight();
    const canvasWidth = this.getWidth();
    this.attractor = new Attractor({
      mass: 100,
      canvasHeight,
      canvasWidth,
    });
    this.mover = new Mover({
      mass: 25,
      x: (canvasWidth / 2) - 300,
      y: (canvasHeight / 2) - 300,
    });

    this.mouseDown = false;
    this.mousePosition = [0, 0];
    this.mouseMovingAttractor = false;

    this.canvas.addEventListener('mousedown', () => {
      this.mouseDown = true;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouseDown = false;
      this.mouseMovingAttractor = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mousePosition = [e.clientX, e.clientY];
    });
  }

  public draw() {
    const { ctx } = this;
    const width = this.getWidth();
    const height = this.getHeight();

    ctx.clearRect(0, 0, width, height);

    
    const mouseCursor = new Victor(this.mousePosition[0], this.mousePosition[1]);
    const isCursorOverAttractor = this.attractor.isAtLocation(mouseCursor);

    if (this.mouseDown && isCursorOverAttractor) this.mouseMovingAttractor = true;

    if (this.mouseMovingAttractor) {
      this.attractor.move(mouseCursor);
    }


    const gravityForce = this.attractor.attract(this.mover);

   
    
    this.mover.applyForce(gravityForce);
    this.mover.update();
    this.mover.display(ctx);
    this.attractor.display(ctx, isCursorOverAttractor);

    this.queueRaf();
  }
}
