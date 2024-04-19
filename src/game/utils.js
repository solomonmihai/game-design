import { Point, Bounds, Container, Graphics } from "pixi.js";

/**
 * @param {Point} point
 * @returns Point
 */
export function normalizePoint(point) {
  const magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
  if (magnitude !== 0) {
    const normalizedX = point.x / magnitude;
    const normalizedY = point.y / magnitude;
    return new Point(normalizedX, normalizedY);
  } else {
    // Return a zero vector if the magnitude is zero to avoid division by zero
    return new Point(0, 0);
  }
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function rand(min, max, floor = false) {
  const val = min + Math.random() * (max - min);

  if (floor) {
    return Math.floor(val);
  }

  return val;
}

/**
 *
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number};
 */
export function dist(p1, p2) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.hypot(a, b);
}

/**
 * @param {Bounds} bounds1
 * @param {Bounds} bounds2
 * @returns {boolean}
 */
export function aabbCollision(bounds1, bounds2) {
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {number} amt
 * @returns number
 */
export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

/**
 *
 * @param {Container} blocks
 * @param {Graphics} graphics
 */
export function convertBlocksToGrid(blocks, graphics) {
  // TODO
  const grid = [];

  const bounds = blocks.getBounds();

  console.log(bounds);
  console.log(blocks.children);

  // draw scene bounds
  graphics.setStrokeStyle(0x000000);
  graphics.lineStyle(3, 0xffffff, 1);
  graphics.rect(bounds.minX, bounds.minY, bounds.width, bounds.height);
  graphics.stroke();

  const cellSize = 40; // min block dimension

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
      row.push(found ? 1 : 0);
    }
    grid.push(row);
  }

  graphics.stroke();

  return grid;
}
