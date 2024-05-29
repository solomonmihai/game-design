import { Container, Graphics, Point } from "pixi.js";
import gsap from "gsap";

import { dist, normalizePoint } from "../utils";
import Player from "./Player";
import Pathfinding from "../pathfinding";
import Scene from "../Scene";

const STATES = {
  PATROL: "patrol",
  CHASE: "chase",
};

const EVENTS = {
  CAUGHT: "caught",
};

export default class Agent extends Container {
  /**
   * @param {Scene} scene
   * @param {Point[]} path
   * @param {Point} pos
   */
  constructor(scene, path, pos) {
    super();

    this._scene = scene;

    this._path = path;
    this.position.copyFrom(pos);

    this._viewAreaRadius = 120;
    this._viewAreaAngle = Math.PI * 0.4;
    this._speed = 2.5;

    this._currentPointIndex = 0;

    this._state = STATES.PATROL;

    this._graphics = this._createGraphics();
    this.addChild(this._graphics);
  }

  static get events() {
    return EVENTS;
  }

  /**
   * @param {Number} dt
   * @param {Player} player
   * @param {Pathfinding} pathfinding
   */
  async move(dt, player, pathfinding) {
    switch (this._state) {
      case STATES.PATROL: {
        await this._patrol(pathfinding);
        break;
      }
      case STATES.CHASE: {
        this._chase(player, pathfinding);
        break;
      }
    }
  }

  /**
   * @param {Player} player
   */
  checkState(player) {
    if (this._state === STATES.PATROL && this._isPlayerInViewCone(player)) {
      this._scene.triggerAgents();
    }
  }

  trigger() {
    this._state = STATES.CHASE;
  }

  /**
   * @param {number} dt
   * @param {Pathfinding} pathfinding
   */
  async _patrol(pathfinding) {
    const nextIndex = this._getNextPointIndex();
    const nextPoint = this._path[nextIndex];
    const nextPointCoords = pathfinding.worldPos(nextPoint);

    if (dist(this.position, nextPointCoords) < 10) {
      this._currentPointIndex = nextIndex;
      return this._patrol(pathfinding);
    }

    const [_, target] = await pathfinding.findPath(this.position, nextPointCoords);

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
   * @param {Player} player
   * @param {Pathfinding} pathfinding
   */
  async _chase(player, pathfinding) {
    try {
      const [_, target] = await pathfinding.findPath(this.position, player.position);

      this._moveToTarget(target);
      this._rotateToTarget(target);
    } catch (err) {}

    if (dist(this.position, player.position) < 10) {
      console.log("emit");
      this.emit(EVENTS.CAUGHT);
    }
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
      duration: this._state === STATES.CHASE ? 0.15 : 0.5,
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

  /**
   * Check if the player is within the view cone of the agent
   * @param {Player} player
   * @returns {boolean}
   */
  _isPlayerInViewCone(player) {
    const distToPlayer = dist(this.position, player.position);
    if (distToPlayer > this._viewAreaRadius) {
      return false;
    }

    const angle = Math.atan2(player.y - this.y, player.x - this.x);

    return (
      this.rotation - this._viewAreaAngle / 2 < angle &&
      this.rotation + this._viewAreaAngle / 2 > angle
    );
  }
}
