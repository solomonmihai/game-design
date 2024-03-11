import { Application } from "pixi.js";

import Scene from "./Scene";

let app;

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
async function initApp(canvas) {
  app = new Application();

  await app.init({
    background: "0xCCA2FF",
    view: canvas,
  });

  app.stage.addChild(new Scene());
}

export { app, initApp };
