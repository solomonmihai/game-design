import { Container, Graphics } from "pixi.js";
import gsap from "gsap";

export default class Scene extends Container {
  constructor() {
    super();

    const graphics = new Graphics();

    // Rectangle
    graphics.rect(0, 0, 100, 100);
    graphics.fill(0xde3249);

    graphics.pivot.set(50, 50);
    graphics.position.set(100, 100);

    this.addChild(graphics);

    gsap.to(graphics, {
      rotation: 10 * Math.PI,
      duration: 2,
      repeat: -1
    });
  }
}
