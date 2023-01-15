# usePosition

**v3.0.0 introduced a breaking change. Please see the section [updating to v3.0.0](#updating-to-v3) below**

This hook helps to know if a element has changed its position on the screen. Relies on requestAnimationFrame and boundingClientRect, so it should work on most modern browsers.

The data returned is a DOMRect object and some extra values I consider important. Check the [reference](#reference)

## Demo

The demo can be viewed [here on stackblitz](https://stackblitz.com/edit/react-ts-byjedw?file=App.tsx)

## Installation

```
    npm i @ernestorb/useposition
```

## How to use it

```javascript
    const elementRef = useRef<HTMLDivElement>() // ref of the element you wanna know its position
    ...
    return <div ref={elementRef}>
    </div> // this element its the one we want
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
const position = usePosition(elementRef, { callOnResize: true });
```

``position` is undefined on the first render, but then it changes to a object. You can see what it returns on the reference below.

## Reference

Check it [here](docs/index.md)

## Updating to v3

The new major version has changed the way the hook returns the element position. It was due the complexity to test and by the need
of accessing the values in a more declarative way.

You have 2 options:

1. Keep using the legacy hook
2. Refactor the dependant code to the new hook.

For the first option you only need to change the import from `usePosition` to `__usePosition`. Example:

```javascript
import { __usePosition } from "@ernestorb/useposition";
```

**The legacy hook will removed in a next update**

## Testing

1. Install all devDependencies
2. Run package.json "test" script

You can check the coverage [here](https://ernestorb.com/usePosition)
