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

    // JOIN new data with old elements (groups and ribbons)
    const groupSelection = svg
      .selectAll('.group')
      .data(chord.groups, d => (d as d3.ChordGroup).index);

    // EXIT old groups
    groupSelection.exit()
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();

    // ENTER new groups
    const groupEnter = groupSelection.enter()
      .append('g')
      .attr('class', 'group');

    groupEnter.append('path')
      .attr('fill', (d, i) => color(d.index))
      .attr('stroke', d => d3.rgb(color(d.index)).darker().toString())
      .attr('d', arc as any)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // UPDATE existing groups
    groupSelection.select('path')
      .transition()
      .duration(1000)
      .attr('d', arc as any);

    // Add text labels to the groups
    groupEnter.append('text')
      .each(d => (d as any).angle = (d.startAngle + d.endAngle) / 2)
      .attr('dy', '.35em')
      .attr('transform', d => `
        rotate(${((d as any).angle * 180 / Math.PI - 90)})
        translate(${outerRadius + 5})
        ${(d as any).angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => (d as any).angle > Math.PI ? 'end' : null)
      .text(d => `Group ${d.index + 1}`)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // JOIN new data with old elements (ribbons)
    const ribbonSelection = svg
      .selectAll('.ribbon')
      .data(chord, d => `${d.source.index}-${d.target.index}`);

    // EXIT old ribbons
    ribbonSelection.exit()
      .transition()
      .duration(1000)
      .attr('opacity', 0)
      .remove();

    // ENTER new ribbons
    ribbonSelection.enter()
      .append('path')
      .attr('class', 'ribbon')
      .attr('d', ribbon as any)
      .attr('fill', d => color(d.target.index))
      .attr('stroke', d => d3.rgb(color(d.target.index)).darker().toString())
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // UPDATE existing ribbons
    ribbonSelection
      .transition()
      .duration(1000)
      .attr('d', ribbon as any);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ChordGraph;
