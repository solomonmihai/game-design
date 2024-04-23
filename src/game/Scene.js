import { Container, Graphics, Point, Rectangle } from "pixi.js";

import { app } from "./App";
import { lerp, rand } from "./utils";
import { convertBlocksToGrid, gridToWorld, Pathfinding, worldToGrid } from "./pathfinding";
import { aabbCollision } from "./utils";

import Block from "./entities/Block";
import Player from "./entities/Player";
import Agent from "./entities/Agent";
import FinalPoint from "./entities/FinalPoint";
import TargetPoint from "./entities/TargetPoint";

export const CELL_SIZE = 40;

export default class Scene extends Container {
  constructor() {
    super();
    this._finalPoint = new FinalPoint(500, 500);
    this.addChild(this._finalPoint);

    this._targetPoint = new TargetPoint(500, 550);
    this.addChild(this._targetPoint);

    this._spawnPoint = new Point(600, 600);

    this._player = new Player(this._spawnPoint);
    this.addChild(this._player);

    this._agent = this._createTestAgent();
    this.addChild(this._agent);

    this._blocks = new Container();
    this._blocks.addChild(...this._genTestBlocks(20));
    this.addChild(this._blocks);

    this._debugGraphics = new Graphics();
    this.addChild(this._debugGraphics);

    this._pathfinding = new Pathfinding(this._blocks, CELL_SIZE, this._debugGraphics);

    this._positionEntities();

    setInterval(() => {
      this._agent.move(0, this._player, this._pathfinding);
    }, 500);

    this._addTicker();
  }

  _createTestAgent() {
    const points = [new Point(100, 100), new Point(500, 100), new Point(300, 300)];

    return new Agent(points);
  }

  /**
   * @param {number} count
   * @returns {Container[]}
   */
  _genTestBlocks(count) {
    const blocks = [];

    const minSize = CELL_SIZE;
    const maxSize = 250;

    const { width, height } = app.canvas;

    for (let i = 0; i < count; i++) {
      const size = new Point(rand(minSize, maxSize), rand(minSize, maxSize));
      const pos = new Point(rand(-width * 2, width * 2), rand(-height * 2, height * 2));

      blocks.push(new Block(pos, size));
    }

    return blocks;
  }

  _addTicker() {
    app.ticker.add(({ deltaTime }) => {
      this._player.move(deltaTime, this._blocks, this._targetPoint);

      const { x: playerX, y: playerY } = this._player.position;

      this.pivot.x = lerp(this.pivot.x, playerX - app.canvas.width / 2, 0.05);
      this.pivot.y = lerp(this.pivot.y, playerY - app.canvas.height / 2, 0.05);

      if (aabbCollision(this._player.getBounds(), this._finalPoint.getBounds())) {
        console.log("Game finished");
      }
    });
  }

  _positionEntities() {
    const grid = this._pathfinding.grid;
    const playerPos = this._pathfinding.worldPos({ x: grid.length - 1, y: grid[0].length - 1 });
    const agentPos = this._pathfinding.worldPos({ x: 0, y: 0 });

    this._player.position.set(playerPos.x, playerPos.y);
    this._agent.position.set(agentPos.x, agentPos.y);
  }
}
