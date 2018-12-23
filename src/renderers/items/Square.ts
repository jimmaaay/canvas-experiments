import Mixin, { Options } from '../Mixin';

export default class Square extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const height = this.getHeight();
    const width = this.getWidth();

    const squareSizeLength = 200;
    const x = width / 2 - squareSizeLength / 2;
    const y = height / 2 - squareSizeLength / 2;

    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'red';
    
    this.ctx.fillRect(x, y, squareSizeLength, squareSizeLength);

    this.ctx.clearRect(x + 10, y + 10, squareSizeLength - 20, squareSizeLength - 20);
    this.ctx.strokeRect(x + 50, y + 50, squareSizeLength - 100, squareSizeLength - 100);

    this.ctx.fillRect(x + 70, y + 70, squareSizeLength - 140, squareSizeLength - 140);
  }
}
