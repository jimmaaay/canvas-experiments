import { getRandomNumber } from './helpers';
class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add(vector1: Vector, vector2: Vector): Vector {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  static sub(vector1: Vector, vector2: Vector): Vector {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  public add(vector: Vector): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  public sub(vector: Vector): void {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  public mult(scale: number): void {
    this.x *= scale;
    this.y *= scale;
  }

  public div(scale: number): void {
    this.x /= scale;
    this.y /= scale;
  }

  public limit(minLimit: number, maxLimit: number) {
    if (this.x < minLimit) this.x = minLimit;
    if (this.y < minLimit) this.y = minLimit;
    if (this.x > maxLimit) this.x = maxLimit;
    if (this.y > maxLimit) this.y = maxLimit;
  }

  /**
   * Gets the vector magnitude. Magnitude === vector length (hypotenuse)
   */
  public mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * @see https://natureofcode.com/book/chapter-1-vectors/#16-normalizing-vectors
   * Normalizing refers to the process of making something “standard” or, well, 
   * “normal.” In the case of vectors, let’s assume for the moment that a 
   * standard vector has a length of 1. To normalize a vector, therefore, is to 
   * take a vector of any length and, keeping it pointing in the same direction,
   * change its length to 1, turning it into what is called a unit vector.
   */
  public normalize() {
    const magnitude = this.mag();
    this.div(magnitude);
  }

  public random2D() {
    this.x = getRandomNumber(0, 100);
    this.y = getRandomNumber(0, 100);
    this.normalize();
  }

}

export default Vector;