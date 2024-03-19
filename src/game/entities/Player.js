import { Container, Graphics, Point } from "pixi.js";

import { app } from "../App";
import { isKeyDown } from "../Input";
import { collisionResponse, normalizePoint, testCollision } from "../utils";

export default class Player extends Container {
  constructor() {
    super();

    this.addChild(this._createGraphics());

    this.position.set(app.canvas.width / 2, app.canvas.height / 2);
    this.pivot.set(this.width / 2, this.height / 2);

    this._speed = 5;
  }

  /**
   * @param {Container} blocks
   */
  checkCollisions(blocks) {
    for (let i = 0; i < blocks.children.length; i++) {
      const block = blocks.children[i];

      if (!testCollision(this, block)) {
        continue;
      }

      const collision = collisionResponse(this, block);

      console.log(collision);
    }
  }

  /**
   * @param {Number} dt
   */
  move(dt) {
    const dir = new Point();

    dir.x -= Number(isKeyDown("a"));
    dir.x += Number(isKeyDown("d"));
    dir.y += Number(isKeyDown("s"));
    dir.y -= Number(isKeyDown("w"));

    const normalizedDir = normalizePoint(dir);

    this.position.x += this._speed * dt * normalizedDir.x;
    this.position.y += this._speed * dt * normalizedDir.y;
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
    return graphics;
  }
}
