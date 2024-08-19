'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChordGraphProps {
  data: number[][];
}

const ChordGraph: React.FC<ChordGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 1200;
    const innerRadius = Math.min(width, height) * 0.5 - 90;
    const outerRadius = innerRadius + 10;

    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)(data);

    const arc = d3.arc<d3.ChordGroup>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon<d3.Chord>().radius(innerRadius);

    const color = d3.scaleOrdinal<number, string>()
      .domain(d3.range(data.length))
      .range(d3.schemeCategory10);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
      .attr('style', 'width: 100%; height: auto; font: 15px sans-serif;');

    // Remove old elements
    svg.selectAll('*').remove();

    // Create groups for arcs
    const groups = svg.append('g')
      .selectAll('g')
      .data(chord.groups)
      .join(
        (enter) =>
          enter.append('g')
            .append('path')
            .attr('fill', (d, i) => color(d.index))
            .attr('stroke', d => d3.rgb(color(d.index)).darker().toString())
            .attr('d', arc as any)
            .attr('opacity', 0)
            .call(enter => enter.transition().duration(1000).attr('opacity', 1)),
        (update) =>
          update.select('path')
            .attr('d', arc as any)
            .call(update => update.transition().duration(1000)),
        (exit) => exit.remove()
      );

    // Add ribbons with transition
    svg.append('g')
      .attr('fill-opacity', 0.67)
      .selectAll('path')
      .data(chord)
      .join(
        (enter) =>
          enter.append('path')
            .attr('d', ribbon as any)
            .attr('fill', d => color(d.target.index))
            .attr('stroke', d => d3.rgb(color(d.target.index)).darker().toString())
            .attr('opacity', 0)
            .call(enter => enter.transition().duration(1000).attr('opacity', 1)),
        (update) =>
          update.attr('d', ribbon as any)
            .call(update => update.transition().duration(2000)),
        (exit) => exit.remove()
      );

    // Add labels
    groups.append('text')
      .each(d => (d as any).angle = (d.startAngle + d.endAngle) / 2)
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${((d as any).angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${(d as any).angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => (d as any).angle > Math.PI ? 'end' : null)
      .text(d => `Group ${d.index + 1}`);

  }, [data]);

  return (
    <div className='tooltip' style={{ display: 'none', position: 'absolute', backgroundColor: 'black', color: 'white', padding: '5px', borderRadius: '3px', pointerEvents: 'none'  }}></div>
    <svg ref={svgRef}></svg>
  );
};

export default ChordGraph;
