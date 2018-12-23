import Mixin, { Options } from '../Mixin';

export default class Basic extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const { ctx } = this;
    const width = this.getWidth();
    const height = this.getHeight();

    ctx.beginPath();

    ctx.moveTo(width / 2, height / 2);
    ctx.quadraticCurveTo(width, 0, width / 2, 0);
    ctx.stroke();
    ctx.closePath();
  }
}
