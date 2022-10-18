# usePosition

This hook helps to know if a element has changed its position on the screen. Relies on requestAnimationFrame and boundingClientRect, so it should work on most modern browsers.

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

1. Store the HTMLElement reference on state
2. Call the hook with the HTMLElement to be watched
3. Define a function to be called whenever the position of the element changes
4. Customize if you want to be called also if the window resize

**Example**

```javascript
useEffect(() => {
    setElement(elementRef.current!);
    // you need to give the HTMLElement, not the Ref itself, its mean to be this way for the rendering
}, []);

usePosition(
    element, ({ left, right, bottom, top, width, height }, { windowResize }) => {
        if(windowResize) {
            // Window has been resized
            return;
        }
        // position of element has changed
    }, { callOnResize: true }, [deps])
```
