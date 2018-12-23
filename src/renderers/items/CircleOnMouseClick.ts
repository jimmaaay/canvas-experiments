import Mixin, { Options } from '../Mixin';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

export default class CircleOnMouseClick extends Mixin {

  private circlesToBeDrawn: any[];
  private previousCircles: any[];

  constructor(props: Options) {
    super(props);

    this.circlesToBeDrawn = [];
    this.previousCircles = [];

    this.mouseClick = this.mouseClick.bind(this);

    canvas.addEventListener('click', this.mouseClick);
  }

  public mouseClick(e: MouseEvent) {
    const x = e.pageX;
    const y = e.pageY;

    this.circlesToBeDrawn.push({
      x,
      y,
    });

    this.queueRaf();
  }

  public draw(redraw: boolean = false) {
    const radius = 10;
    
    if (redraw) {
      this.circlesToBeDrawn = [ ...this.circlesToBeDrawn, ...this.previousCircles ];
    }

    this.circlesToBeDrawn.forEach(({ x, y }) => {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.previousCircles.push({ x, y });
    });

    this.circlesToBeDrawn = [];
  }

  public beforeDestroy() {
    canvas.removeEventListener('click', this.mouseClick);
  }

}
