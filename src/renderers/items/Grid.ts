import Mixin, { Options } from '../Mixin';

export default class Grid extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const height = this.getHeight();
    const width = this.getWidth();

    const gridSize = 20;
    const minViewportDimension = Math.min(height, width);
    const sideLength = minViewportDimension / gridSize;

    const xOffset = minViewportDimension === width
    ? 0
    : (width - height) / 2;

    const yOffset = minViewportDimension === height
    ? 0
    : (height - width) / 2;
    

    const { ctx } = this;

    for (let i = 0; i < gridSize; i++) {

      for (let j = 0; j < gridSize; j++) {
        const x = i * sideLength + xOffset;
        const y = j * sideLength + yOffset;
        
        const isEven = i % 2 === 0
        ? true
        : false;

        const shouldFillIn = isEven
        ? j % 2 === 0
        : j % 2 !== 0;

        if (! shouldFillIn) continue;
  
        ctx.fillRect(x, y, sideLength, sideLength);
      }

    }


  }
}
