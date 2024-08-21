'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, SankeyLink, SankeyNode, sankeyLinkHorizontal } from 'd3-sankey';

interface Node extends SankeyNode<Node, Link> {
  name: string;
}

interface Link extends SankeyLink<Node, Link> {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
}

interface SankeyDiagramProps {
  data: SankeyData;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 2000;
    const height = 2000;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    const tooltip = d3.select('.tooltip');

    const sankey = d3Sankey<Node, Link>()
      .nodeWidth(20)
      .nodePadding(50)
      .extent([
        [1, 1],
        [width - 1, height - 5],
      ]);

    const nodeMap = new Map(data.nodes.map((d, i) => [d.name, i]));

    const sankeyData = {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({
        source: nodeMap.get(d.source) ?? -1,
        target: nodeMap.get(d.target) ?? -1,
        value: d.value,
      })),
    };

    const { nodes, links } = sankey(sankeyData);

    svg.selectAll('*').remove();

    // Define gradients
    const gradientDefs = svg.append('defs');
    gradientDefs
      .selectAll('linearGradient')
      .data(links)
      .enter()
      .append('linearGradient')
      .attr('id', (d, i) => `link-gradient-${i}`)
      .attr('x1', '0%')
      .attr('x2', '50%')
      .attr('y1', '0%')
      .attr('y2', '100%')
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', (d) => d3.interpolateRainbow(d.value / d3.max(links, (l) => l.value)!))
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', (d) => d3.interpolateRainbow(d.value / d3.max(links, (l) => l.value)!));

    // Add the links with gradient colors
    const linkSelection = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.6)
      .selectAll('path')
      .data(links)
      .join(
        (enter) => enter
          .append('path')
          .attr('d', sankeyLinkHorizontal())
          .attr('stroke-width', (d) => Math.max(1, d.width))
          .attr('stroke', (d, i) => `url(#link-gradient-${i}`) // Apply the gradient
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(1000).attr('opacity', 1)),
        (update) => update
          .transition().duration(1000)
          .attr('d', sankeyLinkHorizontal())
          .attr('stroke-width', (d) => Math.max(1, d.width)),
        (exit) => exit.transition().duration(1000).attr('opacity', 0).remove()
      );

    // Add the nodes with animation
    const nodeSelection = svg
      .append('g')
      .selectAll('rect')
      .data(nodes)
      .join(
        (enter) => enter
          .append('rect')
          .attr('x', (d) => d.x0!)
          .attr('y', (d) => d.y0!)
          .attr('height', (d) => d.y1! - d.y0!)
          .attr('width', (d) => d.x1! - d.x0!)
          .attr('fill', (d) => d3.schemeCategory10[d.index % 10])
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(1000).attr('opacity', 1)),
        (update) => update
          .transition().duration(1000)
          .attr('x', (d) => d.x0!)
          .attr('y', (d) => d.y0!)
          .attr('height', (d) => d.y1! - d.y0!)
          .attr('width', (d) => d.x1! - d.x0!),
        (exit) => exit.transition().duration(1000).attr('opacity', 0).remove()
      );

    // Add the labels with animation
    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 30)
      .selectAll('text')
      .data(nodes)
      .join(
        (enter) => enter
          .append('text')
          .attr('x', (d) => (d.x0! < width / 5 ? d.x1! + 2 : d.x0! - 6))
          .attr('y', (d) => (d.y1! + d.y0!) / 2)
          .attr('dy', '0.65em')
          .attr('text-anchor', (d) => (d.x0! < width / 7 ? 'start' : 'end'))
          .text((d) => d.name)
          .attr('opacity', 0)
          .call((enter) => enter.transition().duration(1000).attr('opacity', 1)),
        (update) => update
          .transition().duration(1000)
          .attr('x', (d) => (d.x0! < width / 5 ? d.x1! + 2 : d.x0! - 6))
          .attr('y', (d) => (d.y1! + d.y0!) / 2),
        (exit) => exit.transition().duration(1000).attr('opacity', 0).remove()
      );

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SankeyDiagram;
