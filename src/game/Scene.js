import { Container, Point } from "pixi.js";

import { app } from "./App";
import { rand } from "./utils";

import Block from "./entities/Block";
import Player from "./entities/Player";

export default class Scene extends Container {
  constructor() {
    super();

    this._player = new Player();
    this.addChild(this._player);

    this._blocks = new Container();
    this._blocks.addChild(...this._genTestBlocks(1));
    this.addChild(this._blocks);

    this._addTicker();
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
        rand(0, app.canvas.width - size.x),
        rand(0, app.canvas.height - size.y)
      );

      blocks.push(new Block(pos, size));
    }

    return blocks;
  }

  _addTicker() {
    app.ticker.add(({ deltaTime }) => {
      this._player.move(deltaTime);
      this._player.checkCollisions(this._blocks);
    });
  }
}
