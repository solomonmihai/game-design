import { Container, Graphics, Point } from "pixi.js";

import { app } from "./App";
import { aabbCollision, lerp } from "./utils";
import Pathfinding, { gridToWorld } from "./pathfinding";

import Block from "./entities/Block";
import Player from "./entities/Player";
import Agent from "./entities/Agent";
import FinalPoint from "./entities/FinalPoint";
import TargetPoint from "./entities/TargetPoint";
import levels from "./levels";
import { Bounds } from "pixi.js";

export const CELL_SIZE = 40;

export default class Scene extends Container {
  constructor(level, nextLevel) {
    super();

    this._debugGraphics = new Graphics();
    this._debugGraphics.visible = false;
    this.addChild(this._debugGraphics);

    this._boundsGraphics = new Graphics();
    this.addChild(this._boundsGraphics);

    window.addEventListener("keydown", (evt) => {
      if (evt.key === "p") {
        this._debugGraphics.visible = !this._debugGraphics.visible;
      }
    });

    this._blocks = new Container();
    this._bounds = new Bounds();
    this._agents = [];
    this._player = null;
    this._end = null;
    this._goal = null;
    this._nextLevel = nextLevel;
    this._isEndActive = false;

    this._loadLevel(levels[level]);

    this._pathfinding = new Pathfinding(this._blocks, this._bounds, CELL_SIZE, this._debugGraphics);

    setInterval(() => {
      this._agents.forEach((agent) => {
        agent.move(0, this._player, this._pathfinding);
      });
    }, 500);

    this._addTicker();
  }

  get bounds() {
    return this._bounds;
  }

  activateEndPoint() {
    this._isEndActive = true;
    this._end.visible = true;
  }

  _addTicker() {
    app.ticker.add(({ deltaTime }) => {
      this._player.move(deltaTime, this._blocks, this._goal);

      const { x: playerX, y: playerY } = this._player.position;

      this.pivot.x = lerp(this.pivot.x, playerX - app.canvas.width / 2, 0.05);
      this.pivot.y = lerp(this.pivot.y, playerY - app.canvas.height / 2, 0.05);

      if (this._isEndActive && aabbCollision(this._player.getBounds(), this._end.getBounds())) {
        this._nextLevel();
      }
    });
  }

  _loadLevel(level) {
    const { bounds, blocks, agents, start, end, goal } = level;
    const bminx = bounds.x * CELL_SIZE;
    const bminy = bounds.y * CELL_SIZE;
    const bmaxx = bminx + bounds.width * CELL_SIZE;
    const bmaxy = bminy + bounds.height * CELL_SIZE;
    this._bounds = new Bounds(bminx, bminy, bmaxx, bmaxy);

    const playerPos = gridToWorld(start, this._bounds, CELL_SIZE);
    this._player = new Player(this, playerPos, this.activateEndPoint.bind(this));

    const goalPos = gridToWorld(goal, this._bounds, CELL_SIZE);
    this._goal = new TargetPoint(goalPos.x, goalPos.y);

    const endPos = gridToWorld(end, this._bounds, CELL_SIZE);
    this._end = new FinalPoint(endPos.x, endPos.y);
    this._end.visible = false;

    this._blocks.addChild(
      ...blocks.map(({ pos, width, height }) => {
        const blockPos = gridToWorld(pos, this._bounds, CELL_SIZE);
        blockPos.x -= CELL_SIZE / 2;
        blockPos.y -= CELL_SIZE / 2;
        return new Block(blockPos, new Point(width * CELL_SIZE, height * CELL_SIZE));
      })
    );

    this._agents = agents.map(({ path }) => {
      const pos = gridToWorld(path[0], this._bounds, CELL_SIZE);
      return new Agent(path, pos);
    });

    this.addChild(this._player, this._goal, this._end, this._blocks, ...this._agents);

    this._drawBounds();
  }

  _drawBounds() {
    this._boundsGraphics.clear();

    const size = 400;

    this._boundsGraphics.rect(this._bounds.x, this._bounds.y - size, this._bounds.width, size);
    this._boundsGraphics.rect(
      this._bounds.x,
      this._bounds.y + this._bounds.height,
      this._bounds.width,
      size
    );
    this._boundsGraphics.rect(
      this._bounds.x - size,
      this._bounds.y - size,
      size,
      this._bounds.height + size * 2
    );
    this._boundsGraphics.rect(
      this._bounds.x + this.bounds.width,
      this._bounds.y - size,
      size,
      this._bounds.height + size * 2
    );

    this._boundsGraphics.fill(0x460eac);
  }
}
