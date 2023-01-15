/**
 * @public
 */
export interface PositionConfig {
  callOnResize: boolean;
}

/**
 * @public
 */
export interface PositionExtraValues {
  windowResize: boolean;
  screenWidth: number;
  screenHeight: number;
  visible: number;
}

/**
 * @public
 */
export type PositionCallback = (
  rect: DOMRect,
  extra: PositionExtraValues
) => any;

/**
 * @internal
 */
export interface PositionReg {
  id?: string;
  ref?: HTMLElement;
  callback?: PositionCallback;
  prevVal?: DOMRect;
  depsChange?: boolean;
  config: PositionConfig;
}
