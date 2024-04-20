import { Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

import { dist, normalizePoint } from "../utils";
import Player from "./Player";
import { gridToWorld, Pathfinding, worldToGrid } from "../pathfinding";

const STATES = {
  PATROL: "patrol",
  CHASE: "chase",
};

export default class Agent extends Container {
  /**
   * @param {Point[]} path
   */
  constructor(path) {
    super();

    this.position.set(100, 100);
    this._path = path;

    this._viewAreaRadius = 100;
    this._viewAreaAngle = Math.PI / 3;
    this._speed = 2.5;

    this._currentPointIndex = 0;

    this._state = STATES.PATROL;

    this.addChild(this._createGraphics());

    const firstPoint = this._path[this._currentPointIndex];
    this.position.set(firstPoint.x, firstPoint.y);
    this.pivot.set(0.5, 0.5);
  }

  /**
   * @param {Number} dt
   * @param {Player} player
   * @param {Pathfinding} pathfinding
   */
  async move(dt, player, pathfinding) {
    const path = await pathfinding.findPath(this.position, player.position);

    if (!path[1]) {
      return;
    }

    await gsap.to(this.position, {
      x: path[1].x,
      y: path[1].y,
      duration: 0.1,
    });
  }

  /**
   * @param {number} dt
   */
  _patrol(dt) {
    const nextIndex = this._getNextPointIndex();
    const nextPoint = this._path[nextIndex];

    const dir = this._calcDir(nextPoint);
    const velocity = new Point(this._speed * dt * dir.x, this._speed * dt * dir.y);
    this.position.x += velocity.x;
    this.position.y += velocity.y;

    if (dist(this.position, nextPoint) < 5) {
      this._currentPointIndex = nextIndex;

      const target = this._path[this._getNextPointIndex()];
      this._rotateToTarget(target);
    }
  }

  _getNextPointIndex() {
    const next = this._currentPointIndex + 1;
    return next >= this._path.length ? 0 : next;
  }

  /**
   * @param {number} dt
   * @param {Player} player
   */
  _chase(dt, player) {
    const dir = this._calcDir(player.position);
    const velocity = new Point(this._speed * dt * dir.x, this._speed * dt * dir.y);
    this.position.x += velocity.x;
    this.position.y += velocity.y;

    this._rotateToTarget(player.position);
  }

  /**
   * @param {Point} target
   */
  _calcDir({ x, y }) {
    const dir = new Point(x - this.position.x, y - this.position.y);
    return normalizePoint(dir);
  }

  /**
   * @param {Point} target
   */
  _rotateToTarget({ x, y }) {
    const angle = Math.atan2(y - this.position.y, x - this.position.x);
    const rotation = angle;

    // TODO: rotate in the correct direction
    gsap.to(this, {
      rotation,
      duration: 0.3,
    });
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

    graphics.arc(0, 0, this._viewAreaRadius, -this._viewAreaAngle / 2, this._viewAreaAngle / 2);
    graphics.fill(0x222222);

    return graphics;
  }
}
