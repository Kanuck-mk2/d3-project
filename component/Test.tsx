'use client';

import * as d3 from 'd3';

import { useRef, useState } from 'react';

const width = 600;
const height = 300;
const circleRadius = 30;
const initalMousePosition = { x: width / 2, y: height / 2 };

const Test = () => {
  const [mousePosition, setMousePosition] = useState(initalMousePosition);
  const handleMousemove = (event: any) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };
  return (
    <svg width={width} height={height} onMouseMove={handleMousemove}>
      <circle cx={mousePosition.x} cy={mousePosition.y} r={circleRadius} />
    </svg>
  );
};
