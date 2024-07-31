'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChordGraphProps {
  data: number[][];
}

const ChordGraph: React.FC<ChordGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const width = 800;
    const height = 800;
    const innerRadius = Math.min(width, height) * 0.5 - 90;
    const outerRadius = innerRadius + 10;

    const chord = d3
      .chord()
      .padAngle(0.05)
      .sortSubgroups((a, b) => b.value - a.value)(data);

    const arc = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon().radius(innerRadius);

    const color = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;');

    const group = svg
      .append('g')
      .selectAll('g')
      .data(chord.groups)
      .enter()
      .append('g');

    group
      .append('path')
      .attr('fill', (d) => color(d.index))
      .attr('stroke', (d) => d3.rgb(color(d.index)).darker())
      .attr('d', arc)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke-width', 2);
        tooltipRef.current!.style.visibility = 'visible';
        tooltipRef.current!.textContent = `Group ${d.index + 1}: ${d.value}`;
      })
      .on('mousemove', function (event) {
        tooltipRef.current!.style.top = `${event.clientY + 10}px`;
        tooltipRef.current!.style.left = `${event.clientX + 10}px`;
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke-width', null);
        tooltipRef.current!.style.visibility = 'hidden';
      });

    svg
      .append('g')
      .attr('fill-opacity', 0.67)
      .selectAll('path')
      .data(chord)
      .enter()
      .append('path')
      .attr('d', ribbon)
      .attr('fill', (d) => color(d.target.index))
      .attr('stroke', (d) => d3.rgb(color(d.target.index)).darker());
  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

export default ChordGraph;
