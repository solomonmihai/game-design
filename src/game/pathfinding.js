import { Container, Graphics, Bounds, Point } from "pixi.js";
import { js as Easystar } from "easystarjs";

import { aabbCollision } from "./utils";

const easystar = new Easystar();
easystar.setAcceptableTiles([0]);
// easystar.enableDiagonals();
easystar.enableCornerCutting();

/**
 *
 * @param {Container} blocks
 * @param {number} cellSize
 * @param {Graphics} graphics
 * @returns {number[][]} grid
 */
function convertBlocksToGrid(blocks, bounds, cellSize, graphics) {
  const grid = [];

  graphics.rect(bounds.minX, bounds.minY, bounds.width, bounds.height);
  graphics.stroke(0xffffff);

  for (let i = 0; i < bounds.width; i += cellSize) {
    const row = [];
    for (let j = 0; j < bounds.height; j += cellSize) {
      const x = bounds.minX + i;
      const y = bounds.minY + j;

      graphics.rect(x, y, cellSize, cellSize);

      const rect = new Bounds(x, y, x + cellSize, y + cellSize);

      let found = false;
      for (const block of blocks.children) {
        if (aabbCollision(block.getBounds(), rect)) {
          found = true;
          break;
        }
      }

      if (found) {
        graphics.stroke(0xff0000);
      } else {
        graphics.stroke(0xffffff);
      }

      row.push(found ? 1 : 0);
    }
    grid.push(row);
  }

  return grid;
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

/**
 * @param {{ x: number, y: number }} point
 * @param {Bounds} bounds
 * @param {number} cellSize
 * @returns {Point}
 */
function worldToGrid(point, bounds, cellSize) {
  const x = Math.floor((-bounds.minX + point.x) / cellSize);
  const y = Math.floor((-bounds.minY + point.y) / cellSize);

  return new Point(x, y);
}

/**
 * @param {{ x: number, y: number }} point
 * @param {Bounds} bounds
 * @param {number} cellSize
 * @returns {Point}
 */
export function gridToWorld(point, bounds, cellSize) {
  const x = bounds.minX + point.x * cellSize + cellSize / 2;
  const y = bounds.minY + point.y * cellSize + cellSize / 2;

  return new Point(x, y);
}

/**
 * @param {number[][]} grid
 * @param {Point} from
 * @param {Point} to
 *
 */
async function findPath(grid, from, to) {
  easystar.setGrid(transpose(grid));
  return new Promise((resolve, reject) => {
    easystar.findPath(from.x, from.y, to.x, to.y, (path) => {
      if (path) {
        resolve(path);
        return;
      }

      reject(null);
    });

    easystar.calculate();
  });
}

export default class Pathfinding {
  /**
   * @param {Container} blocks
   * @param {Bounds} bounds
   * @param {number} cellSize
   * @param {Graphics} graphics
   */
  constructor(blocks, bounds, cellSize, graphics) {
    this._blocks = blocks;
    this._cellSize = cellSize;
    this._graphics = graphics;

    this._bounds = bounds;

    /** @type {number[][]} */
    this._grid = convertBlocksToGrid(blocks, bounds, cellSize, graphics);
  }

  get grid() {
    return this._grid;
  }

  /**
   * @param {Point} from
   * @param {Point} to
   * @returns {Promise<Point[]>} path
   */
  async findPath(from, to) {
    const fromCoords = worldToGrid(from, this._bounds, this._cellSize);
    const toCoords = worldToGrid(to, this._bounds, this._cellSize);

    const path = await findPath(this._grid, fromCoords, toCoords);

    if (!path) {
      console.log("couldnt find path");
      return null;
    }

    return path.map((/** @type {Point} */ coord) =>
      gridToWorld(coord, this._bounds, this._cellSize)
    );
  }

  /**
   * @param {{ x: number, y: number }} gridPos
   * @returns { Point }
   */
  worldPos(gridPos) {
    return gridToWorld(gridPos, this._bounds, this._cellSize);
  }

  /**
   * @param {{ x: number, y: number }} worldPos
   * @returns { Point }
   */
  gridPos(worldPos) {
    return worldToGrid(worldPos, this._bounds, this._cellSize);
  }
}
