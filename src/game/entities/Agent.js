import { Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

import { dist, normalizePoint } from "../utils";
import Player from "./Player";
import Pathfinding, { gridToWorld } from "../pathfinding";

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

    this._graphics = this._createGraphics();
    this.addChild(this._graphics);

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
    const distanceToPlayer = dist(this.position, player.position);

    if (distanceToPlayer <= this._viewAreaRadius) {
      this._state = STATES.CHASE;
    }

    switch (this._state) {
      case STATES.PATROL: {
        await this._patrol(dt, pathfinding);
        break;
      }
      case STATES.CHASE: {
        this._chase(dt, player, pathfinding);
        break;
      }
    }
  }

  /**
   * @param {number} dt
   * @param {Pathfinding} pathfinding
   */
  async _patrol(dt, pathfinding) {
    const nextIndex = this._getNextPointIndex();
    const nextPoint = this._path[nextIndex];

    const [_, target] = await pathfinding.findPath(this.position, pathfinding.worldPos(nextPoint));

    if (!target) {
      return;
    }

    this._moveToTarget(target);
    this._rotateToTarget(target);
  }

  _getNextPointIndex() {
    const next = this._currentPointIndex + 1;
    return next >= this._path.length ? 0 : next;
  }

  /**
   * @param {number} dt
   * @param {Player} player
   * @param {Pathfinding} pathfinding
   */
  async _chase(dt, player, pathfinding) {
    const [_, target] = await pathfinding.findPath(this.position, player.position);

    this._moveToTarget(target);
    this._rotateToTarget(target);
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
  _moveToTarget(target) {
    gsap.to(this.position, {
      x: target.x,
      y: target.y,
      duration: 0.5,
      ease: "linear",
    });
  }

  /**
   * @param {Point} target
   */
  _rotateToTarget({ x, y }) {
    const angle = Math.atan2(y - this.position.y, x - this.position.x);
    const rotation = angle;

    // TODO: rotate in the correct direction
    gsap.to(this, {
      rotation: rotation,
      duration: 0.1,
      ease: "power1.out",
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
