import { PositionReg } from "./definitions";

export function determineVisibility(rect: DOMRect): number {
  const actualWindowWidth = window.innerWidth;
  const actualWindowHeight = window.innerHeight;
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
  return visibleThreshold;
}

export function getDOMRect(el: HTMLElement): DOMRect {
  const rectRO = el.getBoundingClientRect();
  const rectJSON: string | DOMRect =
    typeof rectRO?.toJSON === "function" ? rectRO.toJSON() : rectRO;
  return typeof rectJSON == "string" ? JSON.parse(rectJSON) : rectJSON;
}

export function hasMoved(previous: DOMRect, current: DOMRect) {
  return previous.top !== current.top || previous.left !== current.left;
}

export function getWindowMeasure(): {
  screenWidth: number;
  screenHeight: number;
} {
  return {
    screenHeight: window.innerHeight,
    screenWidth: window.innerWidth,
  };
}

export function generateID() {
  const n1 = Math.floor(((Math.random() * 100) % 100) + 10);
  const n2 = Date.now();
  return `id-${n1.toString(16)}-${n2.toString(10)}`;
}

export class ClientManager {
  isBrowser = (function () {
    return typeof window !== "undefined";
  })();

  private clients: Array<PositionReg>;
  constructor(clients: Array<PositionReg>) {
    this.clients = clients;
  }

  register(reg: PositionReg) {
    this.clients.push(reg);
  }

  unregister(reg: PositionReg) {
    const index = this.clients.indexOf(reg);
    this.clients.splice(index, index === -1 ? 0 : 1);
  }
}

export const defaultConfig = { callOnResize: true };
