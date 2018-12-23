import Mixin, { Options } from '../Mixin';

export default class Basic extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    this.ctx.fillRect(0, 0, 100, 100);
  }
}
