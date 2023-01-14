/**
 * usePosition Hook
 * @packageDocumentation
 */

import {
  ClientManager,
  determineVisibility,
  getDOMRect,
  hasMoved as hasRectMoved,
} from "./utils";
import { PositionReg } from "./definitions";

const clients: Array<PositionReg> = [];
const clientManager = new ClientManager(clients);

(function () {
  if (!clientManager.isBrowser) return;

  let oldWidth = window.innerWidth;
  let oldHeight = window.innerHeight;
  let lastExecute = 0;

  const watch = (time: DOMHighResTimeStamp) => {
    if (time - lastExecute < 100) {
      window.requestAnimationFrame(watch);
      return;
    }
    lastExecute = time;
    const actualWindowWidth = window.innerWidth;
    const actualWindowHeight = window.innerHeight;
    const windowResize =
      oldWidth !== actualWindowWidth || oldHeight !== actualWindowHeight;

    clients.forEach((client) => {
      if (!client.ref || !client.callback) return;
      const rect = getDOMRect(client.ref);
      const extraValuesObject = {
        windowResize,
        screenWidth: actualWindowWidth,
        screenHeight: actualWindowHeight,
        visible: determineVisibility(rect),
      };
      if (!client.prevVal) {
        client.prevVal = rect;
        client.callback(rect, extraValuesObject);
        return;
      }
      const hasMoved = hasRectMoved(client.prevVal, rect);
      if (!hasMoved) {
        if (client.config.callOnResize && windowResize) {
          client.callback(rect, extraValuesObject);
          return;
        }
        if (client.depsChange) {
          client.depsChange = false;
          client.callback(rect, extraValuesObject);
        }
        return;
      }
      client.prevVal = rect;
      client.callback(rect, extraValuesObject);
    });
    if (windowResize) {
      oldWidth = actualWindowWidth;
      oldHeight = actualWindowHeight;
    }
    window.requestAnimationFrame(watch);
  };

  window.requestAnimationFrame((time) => {
    lastExecute = time;
    watch(time);
  });
})();

export default clientManager;
