import { Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

export default class Agent extends Container {
  /**
   * @param {Point[]} path
   */
  constructor(path) {
    super();

    this._path = path;
    this._currentPointIndex = 0;

    this.addChild(this._createGraphics());

    const firstPoint = this._path[this._currentPointIndex];
    this.position.set(firstPoint.x, firstPoint.y);
    this.pivot.set(0.5, 0.5);

    this._addMovementTween();
  }

  _addMovementTween() {
    const nextIndex = this._getNextPointIndex();
    const { x, y } = this._path[nextIndex];

    const angle = Math.atan2(y - this.position.y, x - this.position.x);
    const rotation = angle;

    gsap.to(this, {
      rotation,
      duration: 0.3,
    });

    gsap.to(this._position, {
      x,
      y,
      duration: 3,
      ease: "linear",
      onComplete: () => {
        this._currentPointIndex = nextIndex;
        this._addMovementTween();
      },
    });
  }

  _getNextPointIndex() {
    const next = this._currentPointIndex + 1;
    return next >= this._path.length ? 0 : next;
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
    graphics.fill(0xde3249);

    graphics.arc(0, 0, 100, -Math.PI / 6, Math.PI / 6);
    graphics.fill(0x222222);

    return graphics;
  }
}
