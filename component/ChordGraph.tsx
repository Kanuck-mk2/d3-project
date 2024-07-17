// components/ChordGraph.tsx
'use client'



import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChordGraphProps {
  data: number[][];
}

const ChordGraph: React.FC<ChordGraphProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 800;
    const height = 800;
    const innerRadius = Math.min(width, height) * 0.5 - 90;
    const outerRadius = innerRadius + 10;

    const chord = d3.chord<number>()
      .padAngle(0.05)
      .sortSubgroups(d3.descending)(data);

    const arc = d3.arc<d3.ChordGroup>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>()
      .radius(innerRadius);

    const color = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

    const svg = d3.select(ref.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;');

    const group = svg.append('g')
      .selectAll('g')
      .data(chord.groups)
      .enter().append('g');

    group.append('path')
      .attr('fill', d => color(d.index))
      .attr('stroke', d => d3.rgb(color(d.index)).darker())
      .attr('d', arc);

    group.append('text')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
      .text(d => `Group ${d.index + 1}`);

    svg.append('g')
      .attr('fill-opacity', 0.67)
      .selectAll('path')
      .data(chord)
      .enter().append('path')
      .attr('d', ribbon)
      .attr('fill', d => color(d.target.index))
      .attr('stroke', d => d3.rgb(color(d.target.index)).darker());

  }, [data]);

  return (
    <svg ref={ref}></svg>
  );
};

export default ChordGraph;
