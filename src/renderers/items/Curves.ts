import Mixin, { Options } from '../Mixin';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

export default class Basic extends Mixin {

  private startPointX: number;
  private startPointY: number;

  private endPointX: number;
  private endPointY: number;

  private controlPointX: number;
  private controlPointY: number;

  constructor(props: Options) {
    super(props);

    const width = this.getWidth();
    const height = this.getHeight();

    this.startPointX = width / 2;
    this.startPointY = height / 2;

    this.endPointX = width / 2;
    this.endPointY = 0;

    this.controlPointX = 5;
    this.controlPointY = height / 2;

    this.canvasClick = this.canvasClick.bind(this);
    // this.canvasPointerDown = this.canvasPointerDown.bind(this);

    this.setToast(`Click anywhere to place the control point for the curve`);

    canvas.addEventListener('click', this.canvasClick);
    // canvas.addEventListener('pointerdown', this.canvasPointerDown);
  }

  // public canvasPointerDown(e: PointerEvent) {
  //   const { pageX, pageY } = e;
  //   console.log(pageX, pageY);
  // }

  private getPoints() {
    return {
      start: [this.startPointX, this.startPointY],
      end: [this.endPointX, this.endPointY],
      control: [this.controlPointX, this.controlPointY],
    };
  }



  public canvasClick(e: MouseEvent) {
    const { pageX, pageY } = e;

    const currentPoints = this.getPoints();

    // TODO: add point detection??
    // const pointToControl = Object
    //   .keys(currentPoints)







    // this.controlPointX = pageX;
    // this.controlPointY = pageY;
    // this.queueRaf();
  }

  public beforeDestroy() {
    canvas.removeEventListener('click', this.canvasClick);
    // canvas.removeEventListener('pointermove', this.canvasPointerMove);
  }

  public draw() {
    const { ctx } = this;
    const width = this.getWidth();
    const height = this.getHeight();

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    ctx.moveTo(this.startPointX, this.startPointY);
    ctx.quadraticCurveTo(this.controlPointX, this.controlPointY, width / 2, 0);
    ctx.stroke();
    ctx.closePath();

    const points = [
      [this.startPointX, this.startPointY],
      [this.controlPointX, this.controlPointY],
      [this.endPointX, this.endPointY],
    ];

    points.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });

    // ctx.beginPath();
    // ctx.arc(this.controlPointX, this.controlPointY, 4, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
  }
}
