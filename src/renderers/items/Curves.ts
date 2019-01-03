import Mixin, { Options } from '../Mixin';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const POINTER_RADIUS = 10;
const POINTER_DUMMY = 2; // how mant pixels each side of the pointer, with it counting as clicked

export default class Curves extends Mixin {

  private points: any;

  private selectedPoint: false | string;

  constructor(props: Options) {
    super(props);

    const width = this.getWidth();
    const height = this.getHeight();

    this.setStartingPositions(width, height);

    this.selectedPoint = false;

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
    this.pointerUp = this.pointerUp.bind(this);

    this.setToast(`Drag the points to change the curve`);

    canvas.addEventListener('pointerdown', this.pointerDown);
    canvas.addEventListener('pointermove', this.pointerMove);
    canvas.addEventListener('pointerup', this.pointerUp);
  }

  public setStartingPositions(width: number, height: number) {
    this.points = {
      start: [ width / 2, height / 2 ],
      end: [ width / 2, POINTER_RADIUS ],
      control: [ POINTER_RADIUS, height / 2 ],
    };
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

  public pointerUp() {
    if (this.selectedPoint !== false) this.queueRaf();
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
    if (selectedPoint !== false) this.queueRaf();
  }

  public beforeDestroy() {
    canvas.removeEventListener('pointerdown', this.pointerDown);
    canvas.removeEventListener('pointermove', this.pointerMove);
    canvas.removeEventListener('pointerup', this.pointerUp);
    canvas.style.cursor = '';
  }

  // Checks if the points are within bounds. If not they will be reset to the starting positions
  public checkPointBounds() {
    const width = this.getWidth();
    const height = this.getHeight();

    const shouldReset = Object.keys(this.points)
      .reduce((shouldReset, key) => {
        if (shouldReset) return true;
        const [x, y] = this.points[key];
        if (x > width) return true;
        if (y > height) return true;
        return false;
      }, false);

    if (shouldReset) this.setStartingPositions(width, height);
  }


  public draw(redraw: boolean) {
    if (redraw) this.checkPointBounds();

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

    // Draws the points which can be dragged about
    Object.keys(this.points)
      .forEach((key) => {
        const [x, y] = this.points[key];
        const isBeingDragged = key === this.selectedPoint;

        ctx.beginPath();
        ctx.arc(x, y, POINTER_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        if (isBeingDragged) {
          const xStart = x - POINTER_RADIUS - POINTER_DUMMY / 2;
          const yStart = y - POINTER_RADIUS - POINTER_DUMMY / 2;
          const dimensions = POINTER_RADIUS * 2 + POINTER_DUMMY / 2;
          ctx.strokeRect(xStart, yStart, dimensions, dimensions);
        }

        ctx.closePath();
      });
  }
}
