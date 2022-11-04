# usePosition

This hook helps to know if a element has changed its position on the screen. Relies on requestAnimationFrame and boundingClientRect, so it should work on most modern browsers.

The data returned is a DOMRect object and some extra values I consider important. Check the [reference](#reference)

## Demo

The demo can be viewed [here on stackblitz](https://stackblitz.com/edit/react-ts-hd7pqd?devToolsHeight=33&file=App.tsx)

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

Check it [here](docs/index.md)

## Testing

1. Install all devDependencies
2. Run package.json "test" script

You can check the coverage here [coverage](https://ernestorb.com/usePosition)
