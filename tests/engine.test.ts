jest.useFakeTimers();
import manager from "../src/engine";
import { PositionReg } from "../src/vite-env";
import { DOMRect } from "./utils";

describe("Engine ", () => {
  let requestAnimationFrame = jest
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation((cb) => {
      setTimeout(() => cb(jest.now()), 1000);
      return 1;
    });
  let element = document.createElement("div");
  let clientBoundingMock = jest.spyOn(element, "getBoundingClientRect");
  let callback = jest.fn();

  beforeEach(() => {
    clientBoundingMock.mockReturnValue(new DOMRect(0, 0, 100, 100));
  });

  afterEach(() => {
    callback.mockClear();
    requestAnimationFrame.mockClear();
  });

  it("JSDOM available", () => {
    expect(manager.isBrowser).toBe(true);
  });

  it("window.requestAnimationFrame works good", () => {
    expect(callback).toBeCalledTimes(0);
    window.requestAnimationFrame(callback);
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
    window.requestAnimationFrame(callback);
    jest.advanceTimersByTime(1000);

    expect(callback).toBeCalledTimes(2);
  });

  it("Callback its called properly on position change", () => {
    expect(callback).toBeCalledTimes(0);
    const object = {
      id: "asd",
      ref: element,
      callback,
      config: { callOnResize: true },
    };
    manager.register(object);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1); // initial call
    expect(requestAnimationFrame).toBeCalledTimes(1);
    clientBoundingMock.mockReturnValue(new DOMRect(20, 20, 120, 120));
    jest.advanceTimersByTime(1000);
    expect(requestAnimationFrame).toBeCalledTimes(2);
    expect(callback).toBeCalledTimes(2); // called because moved
    manager.unregister(object);
  });

  it("Callback its NOT called when position hasn't changed", () => {
    expect(callback).toBeCalledTimes(0);
    const object = {
      id: "asd",
      ref: element,
      callback,
      config: { callOnResize: true },
    };
    manager.register(object);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1); // initial call
    expect(requestAnimationFrame).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(requestAnimationFrame).toBeCalledTimes(2);
    expect(callback).toBeCalledTimes(1); // no called because position is the  same
    manager.unregister(object);
  });

  it("Callback its called when deps has changed", () => {
    expect(callback).toBeCalledTimes(0);
    const object: PositionReg = {
      id: "asd",
      ref: element,
      callback,
      config: { callOnResize: true },
    };
    manager.register(object);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1); // initial call
    expect(requestAnimationFrame).toBeCalledTimes(1);
    object.depsChange = true;
    jest.advanceTimersByTime(1000);
    expect(requestAnimationFrame).toBeCalledTimes(2);
    expect(callback).toBeCalledTimes(2); // called but for deps change
    manager.unregister(object);
  });

  it("Callback its called when window has been resized", () => {
    expect(callback).toBeCalledTimes(0);
    const object: PositionReg = {
      id: "asd",
      ref: element,
      callback,
      config: { callOnResize: true },
    };
    manager.register(object);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1); // initial call
    expect(requestAnimationFrame).toBeCalledTimes(1);
    window.innerHeight = 10000;
    jest.advanceTimersByTime(1000);
    expect(requestAnimationFrame).toBeCalledTimes(2);
    expect(callback).toBeCalledTimes(2); // called but for window resize
    manager.unregister(object);
  });
});
