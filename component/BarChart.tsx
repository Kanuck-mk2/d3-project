'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: number[];  // Array of numbers for bar heights
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Set up x and y scales
    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', 'auto');

    // Remove old elements
    svg.selectAll('*').remove();

    // Create x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => `Item ${i + 1}`));

    // Create y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Bind data and create bars
    svg.selectAll('rect')
      .data(data)
      .join(
        enter => enter.append('rect')
          .attr('x', (_, i) => x(i)!)
          .attr('y', y(0))  // Start from y=0 for animation
          .attr('width', x.bandwidth())
          .attr('height', 0)  // Start height at 0 for animation
          .attr('fill', 'steelblue')
          .call(enter => enter.transition()
            .duration(1000)
            .attr('y', d => y(d))
            .attr('height', d => y(0) - y(d))
          ),
        update => update
          .call(update => update.transition()
            .duration(1000)
            .attr('x', (_, i) => x(i)!)
            .attr('y', d => y(d))
            .attr('height', d => y(0) - y(d))
          ),
        exit => exit
          .call(exit => exit.transition()
            .duration(1000)
            .attr('height', 0)
            .attr('y', y(0))
            .remove()
          )
      );

  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default BarChart;
