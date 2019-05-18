class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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

  public limit(limit: number) {
    if (this.x > limit) this.x = limit;
    if (this.y > limit) this.y = limit;
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

}

export default Vector;