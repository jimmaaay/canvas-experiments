import Mixin, { Options } from '../Mixin';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const POINTER_RADIUS = 4;
const POINTER_DUMMY = 2; // how mant pixels each side of the pointer, with it counting as clicked

export default class Basic extends Mixin {

  private points: any;

  private selectedPoint: false | string;

  constructor(props: Options) {
    super(props);

    const width = this.getWidth();
    const height = this.getHeight();

    this.points = {
      start: [ width / 2, height / 2 ],
      end: [ width / 2, 0 ],
      control: [ 5, height / 2 ],
    };

    this.selectedPoint = false;

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
    this.pointerUp = this.pointerUp.bind(this);

    this.setToast(`Drag the points to change the curve`);

    canvas.addEventListener('pointerdown', this.pointerDown);
    canvas.addEventListener('pointermove', this.pointerMove);
    canvas.addEventListener('pointerup', this.pointerUp);
  }

  public pointerMove(e: PointerEvent) {
    const { pageX, pageY } = e;
  
    if (this.selectedPoint === false) {
      const hoveredPoint = this.getHoveredPoint(pageX, pageY);
      if (hoveredPoint === false) canvas.style.cursor = '';
      else canvas.style.cursor = 'pointer';
      return;
    }

    canvas.style.cursor = 'grab';
    

    this.points[this.selectedPoint][0] = pageX;
    this.points[this.selectedPoint][1] = pageY;
    this.queueRaf();
  }

  public pointerUp(e: PointerEvent) {
    this.selectedPoint = false;
  }

  public getHoveredPoint(pointerX: number, pointerY: number) {

    const possiblePoints = Object
      .keys(this.points)
      .reduce((selected: any[], key) => {
        const [x, y] = this.points[key];
        const pxFromXCenter = Math.abs(x - pointerX);
        const pxFromYCenter = Math.abs(y - pointerY);
        const dopeVariableName = POINTER_RADIUS * 2 + POINTER_DUMMY * 2;
        if (pxFromXCenter <= dopeVariableName && pxFromYCenter <= dopeVariableName) {
          selected.push({ key, x:pxFromXCenter, y:pxFromYCenter });
        }
        return selected;
      }, []);

      if (possiblePoints.length === 0) return false;
      return possiblePoints.sort((a, b) => {
        const { x:aX, y:aY } = a;
        const { x:bX, y:bY } = b;

        if (aX < bX && aY < bY) return -1;
        if (aX > bX && aY > bY) return 1;

        return aX + aY < bX + bY
        ? -1
        : 1
      })[0].key;

  }


  public pointerDown(e: PointerEvent) {
    const { pageX, pageY } = e;
    const selectedPoint = this.getHoveredPoint(pageX, pageY);

    this.selectedPoint = selectedPoint;
  }

  public beforeDestroy() {
    canvas.removeEventListener('pointerdown', this.pointerDown);
    canvas.removeEventListener('pointermove', this.pointerMove);
    canvas.removeEventListener('pointerup', this.pointerUp);
    canvas.style.cursor = '';
  }

  public draw() {
    const { ctx } = this;
    const width = this.getWidth();
    const height = this.getHeight();

    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    ctx.moveTo(this.points.start[0], this.points.start[1]);
    ctx.quadraticCurveTo(
      this.points.control[0], 
      this.points.control[1],
      this.points.end[0],
      this.points.end[1],
    );
    ctx.stroke();
    ctx.closePath();



    Object.keys(this.points)
      .map((key) => this.points[key])
      .forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, POINTER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

    // ctx.beginPath();
    // ctx.arc(this.controlPointX, this.controlPointY, 4, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
  }
}
