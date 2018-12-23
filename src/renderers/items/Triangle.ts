import Mixin, { Options } from '../Mixin';

export default class Basic extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const { ctx } = this;

    const triangleHeight = 100;
    const traingleWidth = 100;
    const width = this.getWidth();
    const height = this.getHeight();
    const startX = width / 2;
    const startY = (height / 2) - (triangleHeight / 2);

    ctx.fillStyle = 'orange';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX - (traingleWidth / 2), startY + triangleHeight);
    ctx.lineTo(startX + (traingleWidth / 2), startY + triangleHeight);
    ctx.fill();

  }
}
