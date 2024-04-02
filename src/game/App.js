import { Application, Graphics } from "pixi.js";
import { CRTFilter } from "pixi-filters";

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

  const filter = new CRTFilter({
    vignetting: 0.5,
  });

  const scene = new Scene();

  const bgGraphics = new Graphics();
  bgGraphics.rect(0, 0, app.canvas.width, app.canvas.height);
  bgGraphics.fill(0xcca2ff);

  // app.stage.filters = filter;

  app.stage.addChild(bgGraphics);
  app.stage.addChild(scene);
}

export { app, initApp };
