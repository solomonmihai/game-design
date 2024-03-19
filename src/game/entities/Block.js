import { Point, Container, Graphics } from "pixi.js";

export default class Block extends Container {
  /**
   * @param {Point} pos
   * @param {Point} size
   * @param {number} color
   */
  constructor(pos, size, color = 0x460eac) {
    super();
    this.position.copyFrom(pos);

    this.addChild(this._createGraphics(size, color));
  }

  /**
   * @param {Point} size
   * @param {number} color
   * @returns {Graphics}
   */
  _createGraphics(size, color) {
    const graphics = new Graphics({
      width: size.x,
      height: size.y,
    });

    graphics.rect(0, 0, size.x, size.y);
    graphics.fill(color);

    return graphics;
  }
}
