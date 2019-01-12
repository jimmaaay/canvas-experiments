import Mixin, { Options } from '../Mixin';

const PACMAN_RADIUS = 50;
const PACMAN_MOUTH_ANIMATION_SPEED = 200;
const PACMAN_MOUTH_MAX_RADIANS = 0.5;

export default class PacMan extends Mixin {

  // private mouthModifier: number;
  // private mouthRadians: number;
  private startTimestamp: false | number;
  private mouthDirection: string; // OPEN or CLOSE

  constructor(props: Options) {
    super(props);

    this.startTimestamp = false;
    this.mouthDirection = 'CLOSE';
  }

  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();
    const x = width / 2;
    const y = height / 2;
    const now = performance.now();

    ctx.clearRect(0, 0, width, height);

    if (this.startTimestamp === false) {
      this.startTimestamp = now;
    }

    const msDiff = now - this.startTimestamp;
    const percentageAnimationCompleted = Math.min(1, msDiff / PACMAN_MOUTH_ANIMATION_SPEED);
    const modifiedRadians = PACMAN_MOUTH_MAX_RADIANS * percentageAnimationCompleted;
    
    const radians = this.mouthDirection === 'OPEN'
      ? modifiedRadians
      : PACMAN_MOUTH_MAX_RADIANS - modifiedRadians

    const closingRadians = radians === 0
      ? Math.PI * 2
      : -radians;

    ctx.fillStyle = '#ffcb00';

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      PACMAN_RADIUS,
      radians,
      closingRadians,
    );

    ctx.lineTo(x - PACMAN_RADIUS / 3, y);
    ctx.fill();

    ctx.closePath();
    ctx.fillStyle = '#000';

    if (percentageAnimationCompleted >= 1) {
      this.startTimestamp = false;
      this.direction = this.direction === 'OPEN'
        ? 'CLOSE'
        : 'OPEN';
    }

    this.queueRaf();
  }
}
