export class DOMRect {
  left: number;
  top: number;
  width: number;
  height: number;
  x: number;
  y: number;
  bottom: number;
  right: number;

  toJSON() {
    return JSON.stringify({ ...this });
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
