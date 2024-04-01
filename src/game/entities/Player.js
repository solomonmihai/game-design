import { Bounds, Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

import { app } from "../App";
import { isKeyDown } from "../Input";
import { normalizePoint, aabbCollision } from "../utils";

export default class Player extends Container {
  constructor() {
    super();

    this.addChild(this._createGraphics());

    this.position.set(app.canvas.width / 2, app.canvas.height / 2);
    this.pivot.set(0.5, 0.5);

    this._speed = 5;

    gsap.from(this.scale, {
      x: 10,
      y: 10,
      duration: 0.8,
      ease: "bounce.out",
    });
  }

  /**
   * @param {Number} dt
   * @param {Container} blocks
   */
  move(dt, blocks) {
    const dir = new Point();

    dir.x -= Number(isKeyDown("a"));
    dir.x += Number(isKeyDown("d"));
    dir.y += Number(isKeyDown("s"));
    dir.y -= Number(isKeyDown("w"));

    const normalizedDir = normalizePoint(dir);

    const displacement = new Point(this._speed * dt * normalizedDir.x, this._speed * dt * normalizedDir.y);

    if (this._checkCollisions(blocks, displacement)) {
      return;
    }

    this.position.x += displacement.x;
    this.position.y += displacement.y;
  }

  /**
   * @param {Container} blocks
   * @param {Point} displacement
   * @returns {boolean}
   */
  _checkCollisions(blocks, displacement) {
    // TODO: convert this so it returns the new appropriate position instead of not moving at all

    const bounds = this.getBounds();
    const newBounds = new Bounds(
      bounds.minX + displacement.x,
      bounds.minY + displacement.y,
      bounds.maxX + displacement.x,
      bounds.maxY + displacement.y
    );

    for (const block of blocks.children) {
      if (aabbCollision(newBounds, block.getBounds())) {
        return true;
      }
    }

    return false;
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
    graphics.fill(0xffffff);
    return graphics;
  }
}
