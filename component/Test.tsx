'use client';

import * as d3 from 'd3';

import { useState } from 'react';

const width = 600;
const height = 300;
const circleRadius = 30;
const initalMousePosition = { x: width / 2, y: height / 2 };



const Test = () => {
  const [mousePosition, setMousePosition] = useState(initalMousePosition);
  const handleMousemOve = (event) => {
    const { clientX, clientY } = event;
    console.log({ clientX, clientY });
  };
  return (
    <svg width={width} height={height} onMouseMove={handleMousemOve}>
      <circle cx={mousePosition.x} cy={mousePosition.y} r={circleRadius} />
    </svg>
  );
};
