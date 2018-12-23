export interface Options {
  ctx: CanvasRenderingContext2D;
  getHeight: Function;
  getWidth: Function;
}

export default class Mixin {

  public ctx: CanvasRenderingContext2D;
  public getWidth: Function;
  public getHeight: Function;

  private rafID: null | number;

  constructor(options: Options) {
    const { ctx, getWidth, getHeight } = options;
    this.ctx = ctx;
    this.getWidth = getWidth;
    this.getHeight = getHeight;
    this.rafID = null;
    this.drawWrapper = this.drawWrapper.bind(this);
  }

  public draw() {
    throw new Error(`draw method has not been overwritten`);
  }

  public beforeDestroy() {}

  public queueRaf() {
    if (this.rafID !== null) return;
    this.rafID = requestAnimationFrame(this.drawWrapper);
  }

  public drawWrapper() {
    this.rafID = null;
    this.draw();
  }
  
  public destroy() {
    this.beforeDestroy();
    if (this.rafID !== null) cancelAnimationFrame(this.rafID);
    this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
  }

}