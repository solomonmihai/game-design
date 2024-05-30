import { Bounds, Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

import { isKeyDown } from "../Input";
import { normalizePoint, aabbCollision } from "../utils";
import Scene from "../Scene";

export default class Player extends Container {
  /**
   * @param {Scene} scene
   * @param {Point} spawnPoint
   * @param {any} activateEndPoint
   */
  constructor(scene, spawnPoint, activateEndPoint) {
    super();

    this._scene = scene;

    this._playerGraphics = this._createGraphics();
    this.addChild(this._playerGraphics);

    this.position.set(spawnPoint.x, spawnPoint.y);
    this.pivot.set(0.5, 0.5);

    this._speed = 3;
    this._activateEndPoint = activateEndPoint;

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
   * @param {Container} target
   */
  move(dt, blocks, target) {
    const dir = new Point();

    dir.x -= Number(isKeyDown("a"));
    dir.x += Number(isKeyDown("d"));
    dir.y += Number(isKeyDown("s"));
    dir.y -= Number(isKeyDown("w"));

    const normalizedDir = normalizePoint(dir);

    const velocity = new Point(
      this._speed * dt * normalizedDir.x,
      this._speed * dt * normalizedDir.y
    );

    if (this._checkBounds()) {
      return;
    }

    if (this._checkCollisions(blocks, velocity)) {
      return;
    }

    if (this._checkCollisionWithTarget(target, velocity)) {
      this._playerGraphics.clear();
      this._playerGraphics.circle(0, 0, 10);
      this._playerGraphics.fill(0x00ffff);
      this.parent.removeChild(target);
      this._activateEndPoint();
    }

    this.position.x += velocity.x;
    this.position.y += velocity.y;
  }

  /**
   * @param {Container} blocks
   * @param {Point} velocity
   * @returns {boolean}
   */
  _checkCollisions(blocks, velocity) {
    const bounds = this.getBounds();
    const newBounds = new Bounds(
      bounds.minX + velocity.x,
      bounds.minY + velocity.y,
      bounds.maxX + velocity.x,
      bounds.maxY + velocity.y
    );

    for (const block of blocks.children) {
      if (aabbCollision(newBounds, block.getBounds())) {
        return true;
      }
    }

    return false;
  }

  _checkBounds() {
    if (this.position.x + 5 > this._scene.bounds.maxX) {
      this.position.x = this._scene.bounds.maxX - 5;
      return true;
    }

    if (this.position.x - 5 < this._scene.bounds.minX) {
      this.position.x = this._scene.bounds.minX + 5;
      return true;
    }

    if (this.position.y + 5 > this._scene.bounds.maxY) {
      this.position.y = this._scene.bounds.maxY - 5;
      return true;
    }

    if (this.position.y - 5 < this._scene.bounds.minY) {
      this.position.y = this._scene.bounds.minY + 5;
      return true;
    }

    return false;
  }

  /**
   * @param {Container} target
   * @param {Point} velocity
   * @returns {boolean}
   */
  _checkCollisionWithTarget(target, velocity) {
    const bounds = this.getBounds();
    const newBounds = new Bounds(
      bounds.minX + velocity.x,
      bounds.minY + velocity.y,
      bounds.maxX + velocity.x,
      bounds.maxY + velocity.y
    );

    const targetBounds = target.getBounds();

    if (aabbCollision(newBounds, targetBounds)) {
      return true;
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
