import SceneGravityCubes from "./js/scenarios/GravityCubes/SceneGravityCubes";
import SceneBouncingBubbles from "./js/scenarios/SceneBouncingBubbles";
import GlobalContext from "./js/template/GlobalContext";
import { askMotionAccess } from "./js/Utils/DeviceAccess";

/** motion sensors authorization */
const btn = document.getElementById("btn-access");
btn.addEventListener(
  "click",
  function () {
    askMotionAccess();
  },
  false
);

/** scenes */
const scene1 = new SceneBouncingBubbles("canvas-scene-1");
const scene2 = new SceneGravityCubes("canvas-scene-2");
const scene3 = new SceneBouncingBubbles("canvas-scene-3");

/** main */
const globalContext = new GlobalContext();
const params = {
  test: 0,
};
if (!!globalContext.debug.ui) {
  globalContext.debug.ui.add(params, "test", 0, 10);
}
const time = globalContext.time;
const update = () => {
  /** exemple css */
  const scale_ = 1 + (Math.cos((5 * time.elapsed) / 1000) / 2 + 0.5) / 20;
  btn.style.transform = `scale(${scale_}, ${1})`;

  /** bubbles + cube scan = is IN or OUT ? */
  const outScene1_up = scene1.bubbles.filter((b) => {
    return b.y < 0;
  });
  const outScene2_up = scene2.cubes.filter((c) => {
    return c.position.y > scene2.height / 2;
  });
  const outScene3_up = scene3.bubbles.filter((b) => {
    return b.y < 0;
  });

  const outScene1_down = scene1.bubbles.filter((b) => {
    return b.y > scene1.height;
  });
  const outScene2_down = scene2.cubes.filter((c) => {
    return c.position.y < -scene2.height / 2;
  });
  const outScene3_down = scene3.bubbles.filter((b) => {
    return b.y > scene3.height;
  });

  /** remove entities (cube + bubble) OUT of their own scene */
  outScene1_up.forEach((bubbleToRemove) => {
    scene1.removeBubble(bubbleToRemove);
  });
  outScene2_up.forEach((cubeToRemove) => {
    scene2.removeCube(cubeToRemove);
  });
  outScene3_up.forEach((bubbleToRemove) => {
    scene3.removeBubble(bubbleToRemove);
  });

  outScene1_down.forEach((bubbleToRemove) => {
    scene1.removeBubble(bubbleToRemove);
  });
  outScene2_down.forEach((cubeToRemove) => {
    scene2.removeCube(cubeToRemove);
  });
  outScene3_down.forEach((cubeToRemove) => {
    scene3.removeBubble(cubeToRemove);
  });

  /** add new entities to corresponding scene, ex: bulle scene 1 -> cube scene 2 */

  outScene1_up.forEach((bubbleToMove) => {
    const newBubble_ = scene3.addBubble(bubbleToMove.x, scene3.height);
    newBubble_.vy = -Math.abs(bubbleToMove.vy);
    newBubble_.vx = bubbleToMove.vx;
  });
  outScene2_up.forEach((cubeToMove) => {
    const newBubble_ = scene1.addBubble(
      cubeToMove.position.x + scene1.width / 2,
      scene1.height
    );
    newBubble_.vy = -Math.abs(newBubble_.vy);
  });
  outScene3_up.forEach((bubbleToMove) => {
    const newCube_ = scene2.addCube(
      bubbleToMove.x - scene1.width / 2,
      -scene2.height / 2
    );
    newCube_.vy = Math.abs(newCube_.vy);
  });

  outScene1_down.forEach((bubbleToMove) => {
    const newCube_ = scene2.addCube(
      bubbleToMove.x - scene1.width / 2,
      scene2.height / 2
    );
    newCube_.vy = Math.abs(newCube_.vy);
  });
  outScene2_down.forEach((cubeToMove) => {
    const newBubble_ = scene3.addBubble(
      cubeToMove.position.x + scene3.width / 2,
      0
    );
    newBubble_.vy = Math.abs(newBubble_.vy);
  });
  outScene3_down.forEach((bubbleToMove) => {
    const newBubble_ = scene1.addBubble(bubbleToMove.x, 0);
    newBubble_.vy = Math.abs(bubbleToMove.vy);
    newBubble_.vx = bubbleToMove.vx;
  });
};
time.on("update", update);

/*
Hello, j'ai trouver comment utiliser le motion capteur en mode dev sans deploy sur vercel :

npm i -D @vitejs/plugin-basic-ssl

Puis modifier le vite.config.mjs :

import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
    root: 'src',
    build: {
        outDir: '../dist'
    },
    plugins: [
        basicSsl()
    ]
}
*/
