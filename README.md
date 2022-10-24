# usePosition

This hook helps to know if a element has changed its position on the screen. Relies on requestAnimationFrame and boundingClientRect, so it should work on most modern browsers.

The data returned is a DOMRect object and some extra values I consider important. Check the [reference](#reference)

## Demo

The demo can be viewed [here on stackblitz](https://stackblitz.com/edit/react-ts-ouyepc?devToolsHeight=33&file=App.tsx)

## Installation

```
    npm i @ernestorb/useposition
```

## How to use it

Given an element like this

```javascript
    const elementRef = useRef<HTMLDivElement>()
    ...
    return <div ref={elementRef}>
    </div>
```

You need to:

1. Import usePosition hook

```javascript
import { usePosition } from "@ernestorb/useposition";
```

2. Get a Ref to the element to be watched
3. Call the hook with the Ref as first arg and a callback as second, optionally pass a config object as third and also optionally a deps list as fourth

## **Example**

```javascript
usePosition(
  elementRef,
  (
    { left, right, bottom, top, width, height } /* DOMRect */,
    { windowResize } /* extra values object */
  ) => {
    if (windowResize) {
      // Window has been resized
      return;
    }
    // position of element has changed
    // do something
  },
  { callOnResize: true },
  [deps]
);
```

## Reference

**Callback**

```typescript
type PositionCallback = (rect: DOMRect, extra: PositionExtraValues) => any;
```

**Extra values**

```typescript
interface PositionExtraValues {
  windowResize: boolean; // has window resized?
  screenWidth: number; // actual screen width
  screenHeight: number; // same but height
  visible: number; // 0 (hidden) to 1 (totally visible) percent of visibility
}
```

**Config object**

```typescript
interface PositionConfig {
  callOnResize: boolean;
}
```
