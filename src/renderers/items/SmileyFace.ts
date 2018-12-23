import Mixin, { Options } from '../Mixin';

export default class Basic extends Mixin {
  constructor(props: Options) {
    super(props);
  }

  public draw() {
    const { ctx } = this;
    const faceRadius = 200;
    const width = this.getWidth();
    const height = this.getHeight();

    const eyeRadius = faceRadius / 8;
    const mouthRadius = faceRadius * 0.75;

    const centerX = width / 2;
    const centerY = height / 2;

    const eyeY = centerY - eyeRadius * 2;
    const leftEyeX = centerX - eyeRadius * 3;
    const rightEyeX = centerX + eyeRadius * 3;

    ctx.strokeStyle = 'orange';

    ctx.beginPath();
    ctx.arc(centerX, centerY, faceRadius, Math.PI * 2, 0, true);
  
    // mouth
    ctx.moveTo(centerX + mouthRadius, centerY);
    ctx.arc(centerX, centerY, mouthRadius, 0, Math.PI, false);

    // left eye
    ctx.moveTo(leftEyeX + eyeRadius, eyeY);
    ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);

    // right eye
    ctx.moveTo(rightEyeX + eyeRadius, eyeY);
    ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);

    ctx.stroke();
    ctx.closePath();

  }
}
