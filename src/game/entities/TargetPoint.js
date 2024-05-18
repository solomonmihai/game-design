import { Graphics, Container } from "pixi.js";

export default class TargetPoint extends Container {
  constructor(x, y) {
    super();
    this.addChild(this._createGraphics());
    this.position.set(x, y);
  }

  /**
   * @returns {Graphics}
   */
  _createGraphics() {
    const graphics = new Graphics({
      width: 10,
      height: 10,
    });
    graphics.circle(0, 0, 10);
    graphics.fill(0x00ffff);
    return graphics;
  }
}
