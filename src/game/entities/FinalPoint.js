import { Container, Graphics, Point } from "pixi.js";

export default class FinalPoint extends Container {
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
    graphics.circle(0, 0, 30);
    graphics.fill(0xff0000);
    return graphics;
  }
}
