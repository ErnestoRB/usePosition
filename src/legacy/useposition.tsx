import { useEffect, useRef } from "react";
import manager from "../engine";
import { generateID } from "../utils";
import { PositionConfig, PositionReg, PositionCallback } from "../definitions";

const defaultConfig = { callOnResize: true };

/**
 * @public
 * Hook used to call the specified callback with the element position
 * @param ref - The React Ref of the element to be watched
 * @param callback - Callback
 * @param config - Behavior config.
 * @param deps - Whenever this dependencies changes the callback is called
 * @deprecated Please see the new hook {@link ../usePosition.tsx#usePosition}
 */
export function usePosition(
  ref: React.RefObject<HTMLElement>,
  callback: PositionCallback,
  config?: PositionConfig,
  deps?: unknown[]
) {
  const clientRef = useRef<PositionReg | undefined>();
  const times = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const idGen = generateID();
    const object = {
      id: idGen,
      ref: ref.current || undefined,
      config: defaultConfig,
    };
    clientRef.current = object;
    manager.register(object);
    return () => {
      manager.unregister(object);
      clientRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (clientRef.current) {
      const reg = clientRef.current;
      reg.callback = callback;
      reg.ref = ref?.current || undefined;
      reg.config = config || defaultConfig;
    }
  }, [ref, callback, config, deps]);

  useEffect(() => {
    times.current += 1;
    if (times.current == 1) return;
    if (clientRef.current) {
      const reg = clientRef.current;
      reg.depsChange = true;
    }
  }, deps || []);
}
