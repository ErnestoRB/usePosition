import React, { useEffect, useRef, useState } from "react";
import { usePosition } from "../useposition";

export default function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [x, setX] = useState(0);
  const [element, setElement] = useState<HTMLDivElement | undefined>();
  usePosition(
    element,
    ({ left }) => {
      console.log(left, open);
    },
    undefined,
    [open]
  );

  useEffect(() => {
    setElement(ref.current!);
  }, []);

  return (
    <div ref={ref} style={{ position: "fixed", left: x }}>
      <button
        type="button"
        onClick={() => {
          setX((x) => x + 1);
        }}
      >
        Mover
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen((x) => !x);
        }}
      >
        Cambiar estado
      </button>
    </div>
  );
}
