import { Point, Container } from "pixi.js";

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
 * @param {Container} object1
 * @param {Container} object2
 * @returns {boolean}
 */
export function testCollision(object1, object2) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

/**
 * @param {Container} object1
 * @param {Container} object2
 * @returns {Point}
 */
export function collisionResponse(object1, object2) {
  const vCollision = new Point(object2.x - object1.x, object2.y - object1.y);

  const distance = dist(object1.position, object2.position);

  const vCollisionNorm = new Point(vCollision.x / distance, vCollision.y / distance);

  return vCollisionNorm;
}
