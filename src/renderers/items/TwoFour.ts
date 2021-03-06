import Victor from 'victor';
import Mixin, { Options } from '../Mixin';

interface MoverArgs {
  width: number;
  height: number;
  mass: number;
  x: number;
  y: number;
}

interface AccelerationArea {
  fill: string;
  xStart: number;
  xEnd: number;
  accelerationValue: number;
}

interface FrictionArea {
  fill: string;
  xStart?: number;
  xEnd?: number;
  frictionValue: number;
};

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
    const { x } = this.velocity;
    const xTwoDecimalPlaces = (Math.round(x * 100) / 100).toFixed(2);
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, this.mass, 0, Math.PI * 2, false);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.font = '30px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillText(xTwoDecimalPlaces, this.location.x, this.location.y);
  }



}

export default class TwoFour extends Mixin {

  private balls: Mover[];
  private frictionAreas: FrictionArea[];
  private accelerationAreas: AccelerationArea[];


  constructor(props: Options) {
    super(props);
    const height = this.getHeight();
    const width = this.getWidth();

    this.accelerationAreas = [{
      xStart: 0,
      xEnd: 200,
      accelerationValue: 9,
      fill: 'rgba(0, 255, 000, 0.3)',
    }];

    this.frictionAreas = [
      {
        xStart: 200,
        xEnd: 300,
        frictionValue: 8.5,
        fill: 'rgba(255, 0, 0, 0.3)',
      },
      {
        xStart: 700,
        xEnd: 900,
        frictionValue: 5,
        fill: 'rgba(255, 0, 100, 0.3)',
      },
    ];
    this.balls = Array.from(new Array(1)).map(_ => {
      const mass = 40;
      const x = 0 + mass;
      const y = height - mass;
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

    ctx.clearRect(0, 0, width, height);

    this.frictionAreas.forEach((area) => {
      if (area.xStart == null || area.xEnd == null) return;
      const { xStart, xEnd, fill, frictionValue } = area;
      ctx.fillStyle = fill;
      ctx.fillRect(xStart, 0, xEnd - xStart, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '30px sans-serif';
      ctx.fillText(frictionValue.toString(), xStart + (xEnd - xStart) / 2, height / 2 );
    });

    this.accelerationAreas.forEach((area) => {
      const { xStart, xEnd, fill, accelerationValue } = area;
      ctx.fillStyle = fill;
      ctx.fillRect(xStart, 0, xEnd - xStart, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '30px sans-serif';
      ctx.fillText(accelerationValue.toString(), xStart + (xEnd - xStart) / 2, height / 2 );
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';

    this.balls.forEach((ball) => {
      // By multiplying the force by the mass it creates more of a gravity like simulation
      const gravity = new Victor(0, 1 * ball.mass);

      const { frictionValue } = this.frictionAreas.reduce((value: FrictionArea, area) => {
        const { x } = ball.location;
        if (area.xStart == null || area.xEnd == null) return value;
        if (x >= area.xStart && x <= area.xEnd) return area;
        return value;
      }, {
        frictionValue: 0,
        fill: 'none',
      });

      const { accelerationValue } = this.accelerationAreas.reduce((value: AccelerationArea, area) => {
        const { x } = ball.location;
        if (area.xStart == null || area.xEnd == null) return value;
        if (x >= area.xStart && x <= area.xEnd) return area;
        return value;
      }, {
        xStart: 0,
        xEnd: 0,
        accelerationValue: 0,
        fill: 'none',
      });

      const friction = ball.velocity
        .clone()
        .multiplyScalar(-1)
        .normalize()
        .multiplyScalarX(frictionValue);

      friction.y = 0;
      
      const acceleration = new Victor(accelerationValue, 0);
      
      ball.applyForce(acceleration);
      ball.applyForce(friction);

      ball.applyForce(gravity);
      ball.update(width, height);
      ball.display(ctx);
      ball.checkEdges();
    });

    this.queueRaf();
  }
}
