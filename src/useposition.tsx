import { useEffect, useRef } from "react";

interface PositionConfig {
  callOnResize: boolean;
}

interface PositionExtraValues {
  windowResize: boolean;
  screenWidth: number;
  screenHeight: number;
}

type PositionCallback = (rect: DOMRect, extra: PositionExtraValues) => any;

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

let oldWidth = window.innerWidth;
let oldHeight = window.innerHeight;
let lastExecute = 0;

const watch = (time: DOMHighResTimeStamp) => {
  if (time - lastExecute < 100) {
    window.requestAnimationFrame(watch);
    return;
  }
  lastExecute = time;
  const actualWidth = window.innerWidth;
  const actualHeight = window.innerHeight;
  const windowResize = oldWidth !== actualWidth || oldHeight !== actualHeight;

  clients.forEach((r) => {
    if (!r.ref || !r.cb) return;
    const rect = r.ref.getBoundingClientRect();
    if (!r.prevVal) {
      r.prevVal = rect;
      return;
    }

    const { top, left } = rect;
    const hasMoved = r.prevVal.top !== top || r.prevVal.left !== left;
    const extraValuesObject = { windowResize, screenWidth: actualWidth, screenHeight: actualHeight };
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
    oldWidth = actualWidth;
    oldHeight = actualHeight;
  }
  window.requestAnimationFrame(watch);
};

window.requestAnimationFrame((time) => {
  lastExecute = time;
  watch(time);
});

const defaultConfig = { callOnResize: true };

export function usePosition(
  ref: React.RefObject<HTMLElement>,
  cb: PositionCallback,
  config?: PositionConfig,
  deps?: unknown[]
) {
  const clientRef = useRef<PositionReg | undefined>();

  useEffect(() => {
    const idGen = generateID();
    const object = { id: idGen, ref: ref.current || undefined, config: defaultConfig };
    clientRef.current = object;
    clients.push(object);
    return () => {
      const index = clients.indexOf(object)
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
