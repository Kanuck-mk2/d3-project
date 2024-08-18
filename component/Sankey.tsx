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

    const sankey = d3Sankey<Node, Link>()
      .nodeWidth(20)
      .nodePadding(10)
      .extent([
        [1, 1],
        [width - 1, height - 5],
      ]);

    // Create a map to get the index of nodes by name
    const nodeMap = new Map(data.nodes.map((d, i) => [d.name, i]));

    const sankeyData = {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({
        source: nodeMap.get(d.source) ?? -1, // Convert name to index
        target: nodeMap.get(d.target) ?? -1, // Convert name to index
        value: d.value,
      })),
    };

    const { nodes, links } = sankey(sankeyData);

    svg.selectAll('*').remove();

    // Add the links with animation
    const linkSelection = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .selectAll('path')
      .data(links)
      .join(
        (enter) => enter
          .append('path')
          .attr('d', sankeyLinkHorizontal())
          .attr('stroke-width', (d) => Math.max(1, d.width))
          .attr('opacity', 0)
          .call(enter => enter.transition().duration(1000).attr('opacity', 1)),
        (update) => update,
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
          .call(enter => enter.transition().duration(1000).attr('opacity', 1)),
        (update) => update,
        (exit) => exit.transition().duration(1000).attr('opacity', 0).remove()
      );

    // Add the labels
    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d) => (d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6))
      .attr('y', (d) => (d.y1! + d.y0!) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0! < width / 2 ? 'start' : 'end'))
      .text((d) => d.name);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SankeyDiagram;
