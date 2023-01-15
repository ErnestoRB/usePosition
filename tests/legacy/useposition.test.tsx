jest.useFakeTimers();
window.innerHeight = 1000;
window.innerWidth = 1000;
import { cleanup, render, screen } from "@testing-library/react";
import { useRef } from "react";
import React from "react";
import { usePosition } from "../../src/legacy/useposition";
import { DOMRect } from "../utils";

const callback = jest.fn();

function TestComponent() {
  const ref = useRef<HTMLDivElement>(null);

  usePosition(ref, callback, { callOnResize: true }, []);

  return <div data-testid="block" ref={ref}></div>;
}

describe("usePosition() + TestComponent", () => {
  let logSpy: jest.SpyInstance;
  let element: HTMLElement;
  let clientBoundingMock: jest.SpyInstance<DOMRect, []>;
  let requestAnimationFrameMock: jest.SpyInstance;
  beforeEach(async () => {
    requestAnimationFrameMock = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        setTimeout(() => cb(jest.now()), 1000);
        return 1;
      });
    logSpy = jest.spyOn(window.console, "log");
    render(<TestComponent></TestComponent>);
    element = await screen.findByTestId("block");
    clientBoundingMock = jest
      .spyOn(element, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, 0, 100, 100)); // suppose a element of width 100, height 100 at (0,0)
  });

  afterEach(() => {
    requestAnimationFrameMock.mockClear();
    logSpy.mockClear();
    callback.mockClear();
    cleanup();
  });

  it("window.requestAnimationFrame works good", () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(callback).toBeCalledTimes(0);
    expect(window.requestAnimationFrame).toBeDefined();
    window.requestAnimationFrame(callback);
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
  });

  it("Component's callback its called on startup", async () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(clientBoundingMock).toBeCalledTimes(0);
    jest.advanceTimersByTime(1000); // initial call 1000
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    expect(callback).toBeCalledTimes(1);
  });

  it("Component's callback its called on move", async () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(clientBoundingMock).toBeDefined();
    clientBoundingMock
      .mockReturnValueOnce(new DOMRect(10, 10, 100, 100)) // first call with this value
      .mockReturnValueOnce(new DOMRect(50, 50, 100, 100)) // second value, callback called due component moved state change
      .mockReturnValueOnce(new DOMRect(100, 50, 100, 100)); // called because moved again
    jest.advanceTimersByTime(3000); // initial call 1000, second at 2000, third at 3000
    expect(window.requestAnimationFrame).toBeCalledTimes(3);
    expect(callback).toBeCalledTimes(3);
  });

  it("Component's callback its NOT called on NOT move", async () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(clientBoundingMock).toBeDefined();
    jest.advanceTimersByTime(3000); // initial call 1000, second at 2000, third at 3000
    expect(window.requestAnimationFrame).toBeCalledTimes(3);
    expect(callback).toBeCalledTimes(1); // one for the first time
  });

  it("Component's callback its called if screen resizes", async () => {
    expect(window.requestAnimationFrame).toBeCalledTimes(0);
    expect(clientBoundingMock).toBeDefined();
    jest.advanceTimersByTime(2000); // two calls
    window.innerHeight = 1001;
    jest.advanceTimersByTime(1000); // three
    expect(window.requestAnimationFrame).toBeCalledTimes(3);
    expect(callback).toBeCalledTimes(2); // one for the initial and the second for moving
  });
});
