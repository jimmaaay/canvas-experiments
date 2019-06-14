import Victor from 'victor';
import Mixin, { Options } from '../Mixin';
import smallPlane from '../assets/small-plane.png';

/**
 * NOTE: This doesn't work very well. Not particularly sure what I'd need to do to fix this
 */
interface MoverArgs {
  image: HTMLImageElement;
  imageWidth: number;
  imageHeight: number;

  mass: number;
  x: number;
  y: number;
  /**
   * Canvas width
   */
  width: number;
  /**
   * Canvas height
   */
  height: number;
}


const GRAVITY = 0.4;

const LIFT_CI = 8;
const AIR_DENSITY = 0.5;

class Mover {
  private location: Victor;
  private acceleration: Victor;
  public velocity: Victor;
  private image: HTMLImageElement;
  private imageWidth: number;
  private imageHeight: number;
  private canvasWidth: number;
  private canvasHeight: number;
  public mass: number;
  public wingArea: number;

  constructor(args: MoverArgs) {
    const { mass, x, y, image, width, height, imageHeight, imageWidth } = args;

    this.wingArea = 10;

    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;

    this.location = new Victor(x, y);
    this.mass = mass;
    this.acceleration = new Victor(0, 0);
    this.velocity = new Victor(1, 0);
    this.image = image;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  public applyForce(force: Victor): void { // force = mass x acceleration. Newtons' second law
    const appliedForce = force.clone().divideScalar(this.mass);
    this.acceleration.add(appliedForce); 
  }

  public update(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;

    this.velocity.add(this.acceleration); // motion 101
    this.location.add(this.velocity);

    this.acceleration.multiplyScalar(0); // resets the acceleration to 0
  }

  // public drag(l: Liquid) {
  //   const speed = this.velocity.magnitude();
  //   const dragMagnitude = speed * speed * l.dragAmount * this.sideLength;

  //   const drag = this.velocity
  //     .clone()
  //     .multiplyScalar(-1)
  //     .normalize()
  //     .multiplyScalar(dragMagnitude);

  //   this.applyForce(drag);
  // }

  public checkEdges(): void {
    const { canvasWidth, canvasHeight, imageWidth, imageHeight, location } = this;

    if (location.x + (imageWidth / 2) > canvasWidth) {
      location.x = 0 + (imageWidth / 2);
    }

    if (location.y + (imageHeight / 2) > canvasHeight) {
      location.y = 0 + (imageHeight / 2);
    } else if (location.y - (imageHeight / 2) < 0) {
      location.y = canvasHeight - (imageHeight / 2);
    }
  }

  public display(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.location.x - (this.imageWidth / 2),
      this.location.y - (this.imageHeight / 2),
    );
  }

}

export default class TwoSeven extends Mixin {
  private isSetup: boolean;
  private setupCallbacks: Function[];
  private planeImage: HTMLImageElement;
  private plane: Mover | null;

  public downPressed: boolean;
  public upPressed: boolean;

  constructor(props: Options) {
    super(props);

    const height = this.getHeight();
    const width = this.getWidth();

    this.downPressed = false;
    this.upPressed = false;

    this.planeImage = new Image();
    this.isSetup = false;
    this.setupCallbacks = [];
    this.plane = null;

    this.planeImage.onload = () => {
      this.isSetup = true;

      this.plane = new Mover({
        width,
        height,
        x: 0 + (this.planeImage.width / 2),
        y: height - (this.planeImage.height * 2),
        mass: 50,
        image: this.planeImage,
        imageWidth: this.planeImage.width,
        imageHeight: this.planeImage.height,
      });

      if (this.setupCallbacks.length === 0) return;
      this.setupCallbacks.forEach(fn => fn());
      this.setupCallbacks = [];
    };

    this.planeImage.src = smallPlane;

    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);

    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
  }

  private keyDown(e: KeyboardEvent) {
    if (e.code !== 'ArrowDown' && e.code !== 'ArrowUp') return;
    switch (e.code) {
      case 'ArrowDown': {
        if (this.upPressed) return;
        this.downPressed = true;
        break;
      }
      case 'ArrowUp': {
        if (this.downPressed) return;
        this.upPressed = true;
        break;
      }
    }
  }

  private keyUp(e: KeyboardEvent) {
    if (e.code !== 'ArrowDown' && e.code !== 'ArrowUp') return;
    switch (e.code) {
      case 'ArrowDown': {
        this.downPressed = false;
        break;
      }
      case 'ArrowUp': {
        this.upPressed = false;
        break;
      }
    }
  }

  public awaitSetup() {
    if (this.isSetup) return Promise.resolve(true);
    return new Promise((resolve) => {
      this.setupCallbacks.push(resolve);
    });
  }

  public draw() {
    if (this.plane == null) return; // stops TS complaining

    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();
    const gravity = new Victor(0, GRAVITY * this.plane.mass);

    let liftCoefficient = LIFT_CI;
    if (this.downPressed) {
      liftCoefficient += -1
    } else if (this.upPressed) {
      liftCoefficient += 1;
    }

    const liftValue = liftCoefficient * this.plane.wingArea * 0.5 * AIR_DENSITY * Math.pow(this.plane.velocity.x, 2) * -1;

    const lift = new Victor(0, liftValue);

    ctx.clearRect(0, 0, width, height);

    this.plane.applyForce(gravity);
    this.plane.applyForce(lift);

    this.plane.update(width, height);
    this.plane.display(ctx);
    this.plane.checkEdges();

    this.queueRaf();
  }
}
