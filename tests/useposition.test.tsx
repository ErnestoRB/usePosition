jest.useFakeTimers();
import { act, cleanup, renderHook } from "@testing-library/react";
import { usePosition } from "../src/useposition";
import { DOMRect } from "./utils";

describe("usePosition hook", () => {
  let element: HTMLElement;
  let refElement: { current: HTMLElement };
  let clientBoundingMock: jest.SpyInstance;
  let requestAnimationFrameMock: jest.SpyInstance;
  beforeEach(() => {
    element = document.createElement("div");
    refElement = { current: element };
    clientBoundingMock = jest.spyOn(element, "getBoundingClientRect");
    clientBoundingMock.mockReturnValue(new DOMRect(0, 0, 100, 100)); // suppose a element of width 100, height 100 at 0,0
    requestAnimationFrameMock = jest.spyOn(window, "requestAnimationFrame");
    requestAnimationFrameMock.mockImplementation((cb) => {
      setTimeout(() => cb(jest.now()), 1000);
      return 1;
    });
  });

  afterEach(() => {
    requestAnimationFrameMock.mockClear();
    clientBoundingMock.mockClear();
    cleanup();
  });

  it("window.requestAnimationFrame works good", () => {
    const callback = jest.fn();
    expect(window.requestAnimationFrame).toBeDefined();
    window.requestAnimationFrame(callback);
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
  });

  it("Hook returns correct values on first render", () => {
    const { result } = renderHook(() => usePosition(refElement as any));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(1);
    expect(result.current?.top).toBe(0);
    expect(result.current?.left).toBe(0);
    expect(result.current?.height).toBe(100);
    expect(result.current?.width).toBe(100);
  });

  it("Hook returns new values when moving", () => {
    const { result } = renderHook(() => usePosition(refElement as any));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(1);
    expect(result.current?.top).toBe(0);
    expect(result.current?.left).toBe(0);
    expect(result.current?.height).toBe(100);
    expect(result.current?.width).toBe(100);
    clientBoundingMock.mockReturnValue(new DOMRect(10, 5, 100, 100));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(2);
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(2);
    expect(result.current?.top).toBe(5);
    expect(result.current?.left).toBe(10);
    expect(result.current?.height).toBe(100);
    expect(result.current?.width).toBe(100);
  });

  it("Hook updates when window resizes", () => {
    const { result } = renderHook(() => usePosition(refElement as any));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(1);
    expect(result.current?.windowResize).toBe(false);

    act(() => {
      window.innerWidth = 9999;
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(2);
    expect(result.current?.windowResize).toBe(true);
    expect(result.current?.screenWidth).toBe(9999);
  });

  it("Hook does nothing when ref is empty", () => {
    const { result } = renderHook(() =>
      usePosition({ current: undefined } as any)
    );
    expect(result.current).toBeUndefined();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(0);
    expect(result.current).toBeUndefined();
  });

  it("Hook does nothing when value is empty", () => {
    const { result } = renderHook(() => usePosition(undefined));
    expect(result.current).toBeUndefined();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(clientBoundingMock).toHaveBeenCalledTimes(0);
    expect(result.current).toBeUndefined();
  });
});
