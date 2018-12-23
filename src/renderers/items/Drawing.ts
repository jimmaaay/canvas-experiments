import Mixin, { Options } from '../Mixin';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

export default class Basic extends Mixin {

  private drawing: boolean;
  private pointsToDraw: any[];

  constructor(props: Options) {
    super(props);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    this.drawing = false;
    this.pointsToDraw = [];

    canvas.addEventListener('mousedown', this.mouseDown);
    canvas.addEventListener('mouseup', this.mouseUp);
    canvas.addEventListener('mousemove', this.mouseMove);
  }

  public mouseMove(e: MouseEvent) {
    if (! this.drawing) return;
    const x = e.pageX;
    const y = e.pageY;

    this.pointsToDraw.push({
      x,
      y,
      newPoint: false,
    });
  }

  public mouseDown(e: MouseEvent) {
    const x = e.pageX;
    const y = e.pageY;

    this.drawing = true;

    this.pointsToDraw.push({
      x,
      y,
      newPoint: true,
    });
  }

  public mouseUp() {
    this.drawing = false;
  }

  public draw() {
    const { ctx } = this;

    this.pointsToDraw.forEach(({ x, y, newPoint }) => {
      if (newPoint) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        return;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    });

    this.pointsToDraw = [];

    this.queueRaf();
  }

  public beforeDestroy() {
    canvas.removeEventListener('mousedown', this.mouseDown);
    canvas.removeEventListener('mouseup', this.mouseUp);
    canvas.removeEventListener('mousemove', this.mouseMove);
  }
}
