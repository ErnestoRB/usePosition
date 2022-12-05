import * as React from "react";
import { useRef, useState } from "react";
import { usePosition } from "../useposition";
import "./style.css";
import { useDrag } from "@use-gesture/react";

export default function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const [callOnResize, setCallOnResize] = useState(true);
  const [open, setOpen] = useState(true);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [childrenPos, setChildrenPos] = useState<{
    left?: number;
    top?: number;
    bottom?: number;
    right?: number;
    transform: string;
    display?: string;
  }>({
    left: 0,
    top: 0,
    transform: "translate(-100%, 50%)",
  });

  const bind = useDrag(
    (state) => {
      if (state.tap) {
        console.log("tap");
        setOpen(!open);
      }
      setX(state.offset[0]);
      setY(state.offset[1]);
    },
    { filterTaps: true }
  );

  usePosition(
    ref,
    (
      { top, left, bottom, right },
      { windowResize, visible, screenHeight, screenWidth }
    ) => {
      if (windowResize) {
        console.log("Window resized and callback called");
      }

      const positionFromBottom = screenHeight - bottom;
      const positionFromRight = screenWidth - right;

      const moreSpace = Math.max(
        top,
        left,
        positionFromBottom,
        positionFromRight
      );

      switch (moreSpace) {
        case top:
          setChildrenPos({
            left: 0,
            top: 0,
            transform: "translate(50%, -100%)",
            display: open ? "" : "none",
          });
          break;
        case left:
          setChildrenPos({
            left: 0,
            top: 0,
            transform: "translate(-100%, 50%)",
            display: open ? "" : "none",
          });
          break;
        case positionFromRight:
          setChildrenPos({
            right: 0,
            top: 0,
            transform: "translate(100%, 50%)",
            display: open ? "" : "none",
          });
          break;
        case positionFromBottom:
          setChildrenPos({
            left: 0,
            bottom: 0,
            transform: "translate(50%, 100%)",
            display: open ? "" : "none",
          });
          break;
      }

      console.log(
        `Right: ${positionFromRight}, Left: ${left}, Top: ${top}, Bottom: ${positionFromBottom}`,
        `is Callin on resize: ${callOnResize}`,
        "Percent visible: " + visible
      );
    },
    { callOnResize }, // pretty expensive
    [callOnResize, open] // if I dont declare open state then the function would have a old valaue
  );

  return (
    <div id="container">
      <h1>Move the red block!</h1>
      <p>Try resizing the window</p>
      <button
        type="button"
        onClick={() => {
          setCallOnResize(!callOnResize);
        }}
      >
        Toggle callback being called when window's resized
      </button>
      <div className="block-container">
        <div
          {...bind()}
          className="block"
          style={{ left: x, top: y }}
          ref={ref}
        >
          Click to hide my child!
          <div className="block-sibling" style={childrenPos}></div>
        </div>
      </div>
    </div>
  );
}
