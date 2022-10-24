import React from 'react';
import { useRef, useState } from 'react';
import { usePosition } from '../useposition';
import './style.css';

export default function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [offset, setOffset] = useState(0);

  const [x, setX] = useState(0);

  usePosition(
    ref,
    ({ left, }, { windowResize, visible }) => {
      if(windowResize){
        alert("Oops. You resized the window,")
      }
      console.log(`Position from left screen edge: ${left}`, `State value: ${open}`, 'Percent visible: ' + visible); // here we declare what we want to do
    },
    undefined,
    [open]
  );

  return (
    <div id='container'  >
      <label htmlFor="offset">Pixel offset (how much the block moves)</label>
      <input
        name="offset"
        type="number"
        value={offset}
        onChange={(e) => setOffset(Number(e.target.value))}
      ></input>
      <button
        type="button"
        onClick={() => {
          setX((x) => x + offset);
        }}
      >
        Move
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen((x) => !x);
        }}
      >
        Change state deps
      </button>
      <div className='block-container'>
      <div className='block' style={{ left: x }} ref={ref}/>
        
      </div>
      
    </div>
  );
}
