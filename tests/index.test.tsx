jest.useFakeTimers();
window.innerHeight = 1000;
window.innerWidth = 1000;
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import Component from "../src/app/Component";

class DOMRect {
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
  bottom: number;
  right: number;

  toJSON(): string {
    return "";
  }

  constructor(l: number, t: number, w: number, h: number) {
    this.left = this.x = l;
    this.top = this.y = t;
    this.bottom = t + h;
    this.right = l + w;
    this.width = w;
    this.height = h;
  }
}

describe("usePosition() + Component.tsx", () => {
  let logSpie: jest.SpyInstance;
  let button: HTMLElement;
  let el: HTMLElement;
  let clientBoundingMock: jest.SpyInstance<DOMRect, []>;
  let requestAnimationFrameMock: jest.SpyInstance;
  beforeEach(async () => {
    requestAnimationFrameMock = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        setTimeout(() => cb(jest.now()), 1000);
        return 1;
      });
    logSpie = jest.spyOn(window.console, "log");
    jest.spyOn(window, "alert").mockImplementation();
    render(<Component />);
    button = await screen.findByTestId("button");
    el = await screen.findByTestId("block");
    clientBoundingMock = jest
      .spyOn(el, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, 0, 100, 100)); // suppose a element of width 100, height 100 at 0,0
  });

  afterEach(() => {
    requestAnimationFrameMock.mockClear();
    logSpie.mockClear();
    cleanup();
  });

  it("window.alert should be mocked", () => {
    window.alert("hello");
    expect(window.alert).toBeCalledTimes(1);
  });

  it("window.requestAnimationFrame works good", () => {
    expect(window.requestAnimationFrame).toBeDefined();
    const cb = jest.fn();
    window.requestAnimationFrame(cb);
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(cb).toBeCalledTimes(1);
  });

  it("Component renders properly", () => {
    expect(screen.findByText(/Pixel offset/)).toBeDefined();
  });

  it("elements are defined", () => {
    expect(el).toBeDefined();
    expect(button).toBeDefined();
  });

  it("Component's callback its called on move", async () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(clientBoundingMock).toBeDefined();
    clientBoundingMock
      .mockReturnValueOnce(new DOMRect(10, 10, 100, 100)) // first value, not callback called with this value
      .mockReturnValueOnce(new DOMRect(50, 50, 100, 100)); // second value, callback called
    jest.advanceTimersByTime(2000); // initial call 1000, second at 2000
    expect(window.requestAnimationFrame).toBeCalledTimes(2);
    expect(window.console.log).toBeCalledWith(
      "Position from left screen edge: 50",
      "State value: true",
      "Percent visible: 1"
    );
  });
});
