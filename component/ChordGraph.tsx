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
      .sortSubgroups(d3.descending)(data);

    const arc = d3
      .arc<d3.DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3.ribbon().radius(innerRadius);

    const color = d3.scaleOrdinal<number, string>(d3.schemeCategory10); // Define color scale

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height].join(' '))
      .attr('style', 'width: 100%; height: auto; font: 10px sans-serif;');

    // Define linear gradients
    const defs = svg.append('defs');

    defs
      .append('linearGradient')
      .attr('id', 'gradient1')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1f77b4'); // Start color

    defs
      .append('linearGradient')
      .attr('id', 'gradient2')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff7f0e'); // End color

    // Update arcs
    const groups = svg
      .selectAll('g')
      .data(chord.groups)
      .join('g');

    groups
      .append('path')
      .attr('fill', (d, i) => i % 2 === 0 ? 'url(#gradient1)' : 'url(#gradient2)') // Apply gradients
      .attr('stroke', (d) => d3.rgb(color(d.index)).darker().toString())
      .attr('d', arc)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1)
      .attr('d', arc);

    // Update ribbons
    svg
      .selectAll('path.ribbon')
      .data(chord)
      .join('path')
      .attr('class', 'ribbon')
      .attr('d', ribbon)
      .attr('fill', (d) => d3.rgb(color(d.target.index)).brighter(0.5).toString()) // Apply color gradient
      .attr('stroke', (d) => d3.rgb(color(d.target.index)).darker())
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1)
      .attr('d', ribbon);

    // Add text labels
    groups
      .append('text')
      .each((d) => {
        (d as any).angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr('dy', '.35em')
      .attr(
        'transform',
        (d) => `
        rotate(${((d as any).angle * 180) / Math.PI - 90})
        translate(${outerRadius + 5})
        ${(d as any).angle > Math.PI ? 'rotate(180)' : ''}
      `,
      )
      .attr('text-anchor', (d) => ((d as any).angle > Math.PI ? 'end' : 'start'))
      .text((d) => `Group ${d.index + 1}`)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // Tooltip handling
    svg.selectAll('path')
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

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div className="tooltip" ref={tooltipRef} style={{ visibility: 'hidden' }}></div>
    </div>
  );
};

export default ChordGraph;
