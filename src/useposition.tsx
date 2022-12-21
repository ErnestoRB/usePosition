/**
 * usePosition Hook
 * @packageDocumentation
 */
import { useEffect, useRef } from "react";
/**
 * @public
 */
export interface PositionConfig {
  callOnResize: boolean;
}

/**
 * @public
 */
export interface PositionExtraValues {
  windowResize: boolean;
  screenWidth: number;
  screenHeight: number;
  visible: number;
}

/**
 * @public
 */
export type PositionCallback = (
  rect: DOMRect,
  extra: PositionExtraValues
) => any;

/**
 * @internal
 */
interface PositionReg {
  id?: string;
  ref?: HTMLElement;
  cb?: PositionCallback;
  prevVal?: DOMRect;
  depsChange?: boolean;
  config: PositionConfig;
}

function generateID() {
  const n1 = Math.floor(((Math.random() * 100) % 100) + 10);
  const n2 = Date.now();
  return `id-${n1.toString(16)}-${n2.toString(10)}`;
}
const clients: Array<PositionReg> = [];

(function () {
  if (typeof window === "undefined") return;

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

    clients.forEach((r) => {
      if (!r.ref || !r.cb) return;
      const rect = r.ref.getBoundingClientRect();
      if (!r.prevVal) {
        r.prevVal = rect;
        return;
      }

      const { top, left } = rect;
      const hasMoved = r.prevVal.top !== top || r.prevVal.left !== left;
      const elementArea = rect.width * rect.height;
      function between(number: number, min: number, max: number) {
        return Math.min(max, Math.max(min, number));
      }
      const visibleArea =
        (between(rect.right, 0, actualWindowWidth) -
          between(rect.left, 0, actualWindowWidth)) *
        (between(rect.bottom, 0, actualWindowHeight) -
          between(rect.top, 0, actualWindowHeight));
      const visibleThreshold = visibleArea / elementArea;
      const extraValuesObject = {
        windowResize,
        screenWidth: actualWindowWidth,
        screenHeight: actualWindowHeight,
        visible: visibleThreshold,
      };
      if (!hasMoved) {
        if (r.config.callOnResize && windowResize) {
          r.cb(rect, extraValuesObject);
          return;
        }
        if (r.depsChange) {
          r.depsChange = false;
          r.cb(rect, extraValuesObject);
        }
        return;
      }
      r.prevVal = rect;
      r.cb(rect, extraValuesObject);
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

const defaultConfig = { callOnResize: true };

/**
 * @public
 * Hook used to retrieve the element DOMRect and some computed value
 * @param ref - The React Ref of the element to be watched
 * @param cb - Callback
 * @param config - Behavior config.
 * @param deps - Some dependencies, if changes the hook retriggers
 */
export function usePosition(
  ref: React.RefObject<HTMLElement>,
  cb: PositionCallback,
  config?: PositionConfig,
  deps?: unknown[]
) {
  const clientRef = useRef<PositionReg | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idGen = generateID();
    const object = {
      id: idGen,
      ref: ref.current || undefined,
      config: defaultConfig,
    };
    clientRef.current = object;
    clients.push(object);
    return () => {
      const index = clients.indexOf(object);
      clients.splice(index, index === -1 ? 0 : 1);
      clientRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (clientRef.current) {
      const reg = clientRef.current;
      reg.cb = cb;
      reg.ref = ref.current || undefined;
      reg.config = config || defaultConfig;
    }
  }, [ref, cb, config]);

  useEffect(() => {
    if (clientRef.current) {
      const reg = clientRef.current;
      reg.depsChange = true;
    }
  }, deps || []);
}
