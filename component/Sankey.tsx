import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, SankeyLink, SankeyNode } from 'd3-sankey';

interface Node extends SankeyNode {
  name: string;
}

interface Link extends SankeyLink<Node, Node> {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: Node[];
  links: Link[];
}

const SankeyDiagram: React.FC<{ data: SankeyData }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 300;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    const sankey = d3Sankey<Node, Link>()
      .nodeWidth(36)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);

    const { nodes, links } = sankey(data);

    svg.selectAll('*').remove();

    // Add the links
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .style('stroke-width', d => Math.max(1, d.width))
      .style('stroke', d => d.index % 2 === 0 ? 'url(#gradient1)' : 'url(#gradient2)') // Apply gradients
      .style('fill', 'none');

    // Add the nodes
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
      .attr('height', d => d.y1 - d.y0)
      .attr('width', sankey.nodeWidth())
      .style('fill', d => d3.scaleOrdinal(d3.schemeCategory10)(d.name) as string)
      .style('stroke', d => d3.rgb(d3.scaleOrdinal(d3.schemeCategory10)(d.name) as string).darker(2).toString())
      .append('title')
      .text(d => `${d.name}\n${d.value}`);

    node.append('text')
      .attr('x', -6)
      .attr('y', d => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d.name)
      .filter(d => d.x0 < width / 2)
      .attr('x', 6 + sankey.nodeWidth())
      .attr('text-anchor', 'start');

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default SankeyDiagram;
