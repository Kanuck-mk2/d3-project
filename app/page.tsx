'use client';
import React, { useState } from 'react';
import ChordGraph from '../component/ChordGraph';
import SankeyDiagram from '../component/Sankey';

type ChordData = number[][];

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export default function Home() {
  // Initialize state with the first dataset for the Chord graph
  const originalData: ChordData = [
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907],
  ];

  const secondData: ChordData = [
    [5000, 2000, 3000, 4000],
    [6000, 7000, 2030, 3000],
    [3000, 4700, 7000, 5000],
    [2000, 3040, 5000, 1000],
  ];

  const [chordData, setChordData] = useState<ChordData>(originalData);
  const [toggle, setToggle] = useState(false);

  const changeData = () => {
    setChordData(toggle ? originalData : secondData);
    setToggle(!toggle);
  };

  // Sankey data definition
  const sankeyData: SankeyData = {
    nodes: [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' },
      { name: 'D' },
      { name: 'E' },
      { name: 'F' },
      { name: 'G' },
      { name: 'H' },
      { name: 'I' },
      { name: 'J' },
      { name: 'K' },
      { name: 'L' },
    ],
    links: [
      { source: 'B', target: 'K', value: 10 },
      { source: 'B', target: 'K', value: 5 },
      { source: 'B', target: 'F', value: 15 },
      { source: 'C', target: 'E', value: 5 },
      { source: 'B', target: 'H', value: 15 },
      { source: 'B', target: 'L', value: 6 },
      { source: 'B', target: 'K', value: 15 },
      { source: 'B', target: 'I', value: 10 },
      { source: 'C', target: 'H', value: 4 },
      { source: 'B', target: 'G', value: 15 },
      { source: 'B', target: 'J', value: 15 },
      { source: 'D', target: 'J', value: 10 },
    ],
  };

  return (
    <div className="flex flex-col justify-center items-center container mx-auto p-1">
      <h1 className="text-center text-white text-2xl font-bold mb-8">
        Data Visualizations
      </h1>
      <div className=" justify-center items-center mb-12">
        <h2 className="text-center text-xl text-white font-semibold mb-4">
          Chord Graph
        </h2>
        <ChordGraph data={chordData} />
        <div className="flex justify-center items-center">
          <button
            type="button"
            className="mt-4 p-4 bg-blue-500 text-black rounded hover:bg-sky-400"
            onClick={changeData}
          >
            Change Data
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-center text-xl text-white font-semibold mb-4">
          Sankey Diagram
        </h2>
        <SankeyDiagram data={sankeyData} />
      </div>
    </div>
  );
}
