import Mixin, { Options } from '../Mixin';

const PACMAN_RADIUS = 50;

export default class PacMan extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const { ctx } = this;
    const height = this.getHeight();
    const width = this.getWidth();

    ctx.fillStyle = '#ffcb00';
    // ctx.fillRect(0, 0, 100, 100);

    ctx.beginPath();

    ctx.arc(
      width / 2,
      height / 2,
      PACMAN_RADIUS,
      0 - (Math.PI * 0.2),
      Math.PI * 0.2,
      true,
    )

    // // Bottom half
    // ctx.arc(
    //   width / 2,
    //   height / 2,
    //   PACMAN_RADIUS,
    //   Math.PI * 0.1,
    //   Math.PI,
    // );

    // // Top half
    // ctx.arc(
    //   width / 2,
    //   height / 2,
    //   PACMAN_RADIUS,
    //   0 - (Math.PI * 0.1),
    //   Math.PI,
    //   true,
    // );

    // const startingX = (width / 2) + PACMAN_RADIUS;
    // const startingY = (height / 2) + (PACMAN_RADIUS * 0.5);

    // ctx.moveTo(startingX, startingY);
    // ctx.arcTo()

    ctx.fill();

    ctx.closePath();
    ctx.fillStyle = '#000';
  }
}
