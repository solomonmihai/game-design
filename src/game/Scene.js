import { Container, Graphics, Point } from "pixi.js";

import { app } from "./App";
import { lerp, rand } from "./utils";
import Pathfinding, { gridToWorld } from "./pathfinding";
import { aabbCollision } from "./utils";

import Block from "./entities/Block";
import Player from "./entities/Player";
import Agent from "./entities/Agent";
import FinalPoint from "./entities/FinalPoint";
import TargetPoint from "./entities/TargetPoint";
import levels from "./levels";
import { Bounds } from "pixi.js";

export const CELL_SIZE = 40;

export default class Scene extends Container {
  constructor(level) {
    super();

    this._debugGraphics = new Graphics();
    // this._debugGraphics.visible = true;
    this.addChild(this._debugGraphics);

    this._blocks = new Container();
    this._bounds = new Bounds();
    this._agents = [];
    this._player = null;
    this._end = null;
    this._goal = null;

    this._loadLevel(levels[0]);

    this._pathfinding = new Pathfinding(this._blocks, this._bounds, CELL_SIZE, this._debugGraphics);

    setInterval(() => {
      this._agents.forEach((agent) => {
        agent.move(0, this._player, this._pathfinding);
      });
    }, 500);

    this._addTicker();
  }

  _addTicker() {
    app.ticker.add(({ deltaTime }) => {
      this._player.move(deltaTime, this._blocks, this._goal);

      const { x: playerX, y: playerY } = this._player.position;

      this.pivot.x = lerp(this.pivot.x, playerX - app.canvas.width / 2, 0.05);
      this.pivot.y = lerp(this.pivot.y, playerY - app.canvas.height / 2, 0.05);

      // if (aabbCollision(this._player.getBounds(), this._end.getBounds())) {
      // console.log("Game finished");
      // }
    });
  }

  _loadLevel(level) {
    const { bounds } = level;
    const bminx = bounds.x * CELL_SIZE;
    const bminy = bounds.y * CELL_SIZE;
    const bmaxx = bminx + bounds.width * CELL_SIZE;
    const bmaxy = bminy + bounds.height * CELL_SIZE;
    this._bounds = new Bounds(bminx, bminy, bmaxx, bmaxy);

    const playerPos = gridToWorld(level.start, this._bounds, CELL_SIZE);
    this._player = new Player(playerPos);

    const goalPos = gridToWorld(level.goal, this._bounds, CELL_SIZE);
    this._goal = new TargetPoint(goalPos.x, goalPos.y);

    const endPos = gridToWorld(level.end, this._bounds, CELL_SIZE);
    this._end = new FinalPoint(endPos.x, endPos.y);

    this._blocks.addChild(
      ...level.blocks.map(({ pos, width, height }) => {
        const blockPos = gridToWorld(pos, this._bounds, CELL_SIZE);
        return new Block(blockPos, new Point(width * CELL_SIZE, height * CELL_SIZE));
      })
    );

    this._agents = level.agents.map(({ path }) => {
      const pos = gridToWorld(path[0], this._bounds, CELL_SIZE);
      return new Agent(path, pos);
    });

    this.addChild(this._player, this._goal, this._end, this._blocks, ...this._agents);
  }
}
