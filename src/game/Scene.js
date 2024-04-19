import { Container, Graphics, Point } from "pixi.js";

import { app } from "./App";
import { convertBlocksToGrid, lerp, rand } from "./utils";

import Block from "./entities/Block";
import Player from "./entities/Player";
import Agent from "./entities/Agent";

export default class Scene extends Container {
  constructor() {
    super();

    this._player = new Player();
    this.addChild(this._player);

    this._agent = this._createTestAgent();
    this.addChild(this._agent);

    this._blocks = new Container();
    this._blocks.addChild(...this._genTestBlocks(10));
    this.addChild(this._blocks);

    this._addTicker();

    const debugGraphics = new Graphics();
    this.addChild(debugGraphics);

    const grid = convertBlocksToGrid(this._blocks, debugGraphics);
    console.log('grid', grid);
  }

  _createTestAgent() {
    const points = [
      new Point(100, 100),
      new Point(500, 100),
      new Point(300, 300),
    ];

    return new Agent(points);
  }

  /**
   * @param {number} count
   * @returns {Container[]}
   */
  _genTestBlocks(count) {
    const blocks = [];

    const minSize = 40;
    const maxSize = 250;

    for (let i = 0; i < count; i++) {
      const size = new Point(rand(minSize, maxSize), rand(minSize, maxSize));
      const pos = new Point(
        rand(-app.canvas.width, app.canvas.width),
        rand(-app.canvas.height, app.canvas.height)
      );

      blocks.push(new Block(pos, size));
    }

    return blocks;
  }

  _addTicker() {
    app.ticker.add(({ deltaTime }) => {
      this._player.move(deltaTime, this._blocks);
      this._agent.move(deltaTime, this._player);

      const { x: playerX, y: playerY } = this._player.position;

      this.pivot.x = lerp(this.pivot.x, playerX - app.canvas.width / 2, 0.05);
      this.pivot.y = lerp(this.pivot.y, playerY - app.canvas.height / 2, 0.05);
    });
  }
}
