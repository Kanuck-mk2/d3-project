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

    // Generate the chord layout
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

    // Remove old elements before rendering new ones
    svg.selectAll('*').remove();

    // Create groups for arcs
    const groups = svg.append('g')
      .selectAll('g')
      .data(chord.groups)
      .join(
        (enter) =>
          enter.append('g')
            .append('path')
            .attr('fill', (d, i) => i % 2 === 0 ? 'url(#gradient1)' : 'url(#gradient2)')
            .attr('stroke', d => d3.rgb(color(d.index)).darker().toString())
            .attr('d', arc as any)
            .attr('opacity', 0) // Start with opacity 0 for fade-in effect
            .call(enter => enter.transition().duration(1000).attr('opacity', 1)), // Fade-in effect
        (update) =>
          update.select('path')
            .attr('d', arc as any)
            .call(update => update.transition().duration(1000)), // Smooth update transition
        (exit) => exit.remove() // Remove elements that are no longer needed
      );

    // Add ribbons between the arcs
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
            .attr('opacity', 0) // Start with opacity 0 for fade-in effect
            .call(enter => enter.transition().duration(1000).attr('opacity', 1)), // Fade-in effect
        (update) =>
          update.attr('d', ribbon as any)
            .call(update => update.transition().duration(1000)), // Smooth update transition
        (exit) => exit.remove() // Remove elements that are no longer needed
      );

    // Add labels to the arcs
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

    // Tooltip setup
    const tooltip = d3.select(tooltipRef.current)
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '1px')
    .style('border-radius', '5px')
    .style('padding', '10px');

    // Event listeners for the tooltip
    svg.selectAll('path')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 2);
        tooltip.style('visibility', 'visible');
        
        // Check if `d` is a ribbon
        const isRibbon = (d as any).source && (d as any).target;
        const value = isRibbon ? (d as any).source.value : (d as any).value;
        
        tooltip.text(`Value: ${value}`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', `${event.pageY - 20}px`)
          .style('left', `${event.pageX + 20}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', null);
        tooltip.style('visibility', 'hidden');
      });

  }, [data]); // Re-render and animate when `data` changes

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="absolute bg-white text-black p-2 rounded border" style={{ visibility: 'hidden' }}></div>
    </div>
  );
};

export default ChordGraph;
