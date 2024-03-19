import { Application } from "pixi.js";

import { addInputListeners } from "./Input";
import Scene from "./Scene";

/**
 * @type Application
 */
let app;

/**
 *
 * @param {HTMLCanvasElement} canvas
 */
async function initApp(canvas) {
  app = new Application();

  await app.init({
    background: "0xCCA2FF",
    canvas,
    antialias: false,
  });

  addInputListeners();

  app.stage.addChild(new Scene());
}

export { app, initApp };
