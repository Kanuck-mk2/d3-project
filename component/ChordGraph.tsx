'use client'


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

    // Clear existing content
    svg.selectAll('*').remove();

    // Define linear gradients
    const defs = svg.append('defs');
    const gradient1 = defs.append('linearGradient')
      .attr('id', 'gradient1')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    gradient1.append('stop').attr('offset', '0%').attr('stop-color', '#1f77b4');
    gradient1.append('stop').attr('offset', '100%').attr('stop-color', '#aec7e8');

    const gradient2 = defs.append('linearGradient')
      .attr('id', 'gradient2')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    gradient2.append('stop').attr('offset', '0%').attr('stop-color', '#ff7f0e');
    gradient2.append('stop').attr('offset', '100%').attr('stop-color', '#ffbb78');

    // Create groups
    const groups = svg.append('g')
      .selectAll('g')
      .data(chord.groups)
      .join('g');

    // Add arcs
    groups.append('path')
      .attr('fill', (d, i) => i % 2 === 0 ? 'url(#gradient1)' : 'url(#gradient2)')
      .attr('stroke', d => d3.rgb(color(d.index)).darker().toString())
      .attr('d', arc as any)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // Add ribbons
    svg.append('g')
      .attr('fill-opacity', 0.67)
      .selectAll('path')
      .data(chord)
      .join('path')
      .attr('d', ribbon as any)
      .attr('fill', d => color(d.target.index))
      .attr('stroke', d => d3.rgb(color(d.target.index)).darker().toString())
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

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
      .text((d, i) => `Group ${i + 1}`)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // Tooltip handling
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    svg.selectAll('path')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 2);
        tooltip.style('visibility', 'visible');
        tooltip.text(`Value: ${(d as any).source ? (d as any).source.value : d.value}`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', null);
        tooltip.style('visibility', 'hidden');
      });

  }, [data]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef} className="absolute" style={{ visibility: 'hidden' }}></div>
    </div>
  );
};

export default ChordGraph;