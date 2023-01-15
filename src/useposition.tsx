import { useEffect, useRef, useState } from "react";
import manager from "./engine";
import { defaultConfig, generateID } from "./utils";
import {
  PositionConfig,
  PositionReg,
  PositionExtraValues,
} from "./definitions";

/**
 * @public
 * Hook used to retrieve the element position
 * @param ref - The React Ref of the element to be watched
 * @param config - Behavior config.
 */
export function usePosition(
  ref: React.RefObject<HTMLElement>,
  config?: PositionConfig
) {
  const clientRef = useRef<PositionReg | undefined>();

  const [data, setData] = useState<(DOMRect & PositionExtraValues) | undefined>(
    undefined
  );

  /*   useEffect(() => {
    if (ref.current) {
      const initialRect = getDOMRect(ref.current);
      setData({
        ...initialRect,
        windowResize: false,
        visible: determineVisibility(initialRect),
        ...getWindowMeasure(),
      });
    }
  }, []);
 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idGen = generateID();
    const object: PositionReg = {
      id: idGen,
      callback: (rect, extra) => {
        const data = {
          ...rect,
          ...extra,
        };
        setData(data);
      },
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
      reg.ref = ref?.current || undefined;
      reg.config = config || defaultConfig;
    }
  }, [ref, config]);
  return data;
}
